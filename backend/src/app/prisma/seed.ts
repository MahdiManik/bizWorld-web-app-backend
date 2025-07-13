import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

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

async function main() {
  try {
    for (const adminData of adminUsers) {
      // Check if admin already exists
      const existingAdmin = await prisma.admin.findUnique({
        where: { email: adminData.email },
      });

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminData.password, 12);

        await prisma.admin.create({
          data: {
            ...adminData,
            password: hashedPassword,
          },
        });

        console.log(`✅ Admin user ${adminData.email} created successfully`);
      } else {
        console.log(`ℹ️ Admin user ${adminData.email} already exists`);
      }
    }
  } catch (error) {
    console.error("❌ Error creating admin users:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
