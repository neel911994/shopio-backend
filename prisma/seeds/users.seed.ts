import bcrypt from "bcryptjs";
import {PrismaClient} from "@prisma/client";

interface UserSeed {
  name: string;
  email: string;
  role: string;
  rawPassword: string;
}

export default async function seedUsers(prisma: PrismaClient) {
  const users: UserSeed[] = [
    {
      name: "Shopio Admin",
      email: "admin@shopio.com",
      role: "ADMIN",
      rawPassword: "Admin@123"
    },
    {
      name: "Shopio Staff",
      email: "staff@shopio.com",
      role: "STAFF",
      rawPassword: "Staff@123"
    }
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.rawPassword, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role as any, // Assuming role enum matches
        status: "ACTIVE"
      }
    });
  }

  console.log("👤 Admin and Staff users seeded with different passwords");
}
