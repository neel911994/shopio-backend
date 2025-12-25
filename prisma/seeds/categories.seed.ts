import type { PrismaClient } from "@prisma/client";
export default async function seedCategories(prisma: PrismaClient){
  await prisma.category.createMany({
    data: [
      { name: "Electronics" },
      { name: "Fashion" },
      { name: "Home & Kitchen" },
      { name: "Beauty" },
      { name: "Sports" }
    ],
    skipDuplicates: true
  });

  console.log("📦 Categories seeded");
}
