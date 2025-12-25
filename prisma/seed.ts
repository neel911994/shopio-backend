import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import seedUsers from "./seeds/users.seed";
import seedCategories from "./seeds/categories.seed";
import seedProducts from "./seeds/products.seed";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  await seedUsers(prisma);
  await seedCategories(prisma);
  await seedProducts(prisma);

  console.log("🌱 Database seeding completed successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
