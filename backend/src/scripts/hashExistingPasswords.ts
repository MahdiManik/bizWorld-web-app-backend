import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

/**
 * Script to hash all existing plaintext passwords in the database
 * Run this once to secure your database by converting plaintext passwords to bcrypt hashes
 */
const hashExistingPasswords = async () => {
  try {
    console.log("Starting password hashing process...");
    
    // Get all users
    const users = await prisma.user.findMany({
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
        const hashedPassword = await bcrypt.hash(user.password, 12);
        
        // Update user with hashed password
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        });
        
        console.log(`Successfully hashed password for user: ${user.email}`);
        hashedCount++;
      } catch (error) {
        console.error(`Error processing user ${user.email}:`, error);
      }
    }
    
    console.log("Password hashing complete!");
    console.log(`Results: ${hashedCount} passwords hashed, ${alreadyHashedCount} already hashed`);
  } catch (error) {
    console.error("Error in password hashing script:", error);
  } finally {
    await prisma.$disconnect();
  }
};

// Run the function
hashExistingPasswords();
