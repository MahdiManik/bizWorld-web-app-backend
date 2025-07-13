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
// Define multiple admin users
const adminUsers = [
    {
        name: "Yeakub Ali",
        email: "yeakub1370@gmail.com",
        password: "Test1234",
        phone: "01765432100",
        country: "Bangladesh",
        address: "Kushtia, Bangladesh",
        location: "Dhaka",
        company: "NexStack",
        website: "https://nexstack.sg",
        bio: "I am a software engineer with 10 years of experience in the field.",
        image: "https://i.ibb.co/fS4rpzw/team-img-2-1.jpg",
        role: "ADMIN",
    },
];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (const adminData of adminUsers) {
                // Check if admin already exists
                const existingAdmin = yield prisma.admin.findUnique({
                    where: { email: adminData.email },
                });
                if (!existingAdmin) {
                    const hashedPassword = yield bcrypt_1.default.hash(adminData.password, 12);
                    yield prisma.admin.create({
                        data: Object.assign(Object.assign({}, adminData), { password: hashedPassword }),
                    });
                    console.log(`✅ Admin user ${adminData.email} created successfully`);
                }
                else {
                    console.log(`ℹ️ Admin user ${adminData.email} already exists`);
                }
            }
        }
        catch (error) {
            console.error("❌ Error creating admin users:", error);
            process.exit(1);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
main();
