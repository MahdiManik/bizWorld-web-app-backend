"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
/**
 * Script to hash all existing plaintext passwords in the database
 * Run this once to secure your database by converting plaintext passwords to bcrypt hashes
 */
const hashExistingPasswords = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Starting password hashing process...");
        // Get all users
        const users = yield prisma.user.findMany({
            select: {
                id: true,
                password: true,
                email: true
            }
        });
        console.log(`Found ${users.length} users to process`);
        let hashedCount = 0;
        let alreadyHashedCount = 0;
        for (const user of users) {
            try {
                // Check if password might already be hashed (bcrypt hashes start with $2a$, $2b$ or $2y$)
                if (user.password.startsWith('$2')) {
                    console.log(`User ${user.email} already has a hashed password`);
                    alreadyHashedCount++;
                    continue;
                }
                // Hash the plaintext password
                const hashedPassword = yield bcrypt_1.default.hash(user.password, 12);
                // Update user with hashed password
                yield prisma.user.update({
                    where: { id: user.id },
                    data: { password: hashedPassword }
                });
                console.log(`Successfully hashed password for user: ${user.email}`);
                hashedCount++;
            }
            catch (error) {
                console.error(`Error processing user ${user.email}:`, error);
            }
        }
        console.log("Password hashing complete!");
        console.log(`Results: ${hashedCount} passwords hashed, ${alreadyHashedCount} already hashed`);
    }
    catch (error) {
        console.error("Error in password hashing script:", error);
    }
    finally {
        yield prisma.$disconnect();
    }
});
// Run the function
hashExistingPasswords();
