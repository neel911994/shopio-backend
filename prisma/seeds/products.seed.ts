import { faker } from "@faker-js/faker";
import type { PrismaClient } from "@prisma/client";

interface ProductSeed {
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  categoryId: string;
}

export default async function seedProducts(prisma: PrismaClient) {
  const categories = await prisma.category.findMany();
  const products: ProductSeed[] = [];

  for (let i = 0; i < 100; i++) {
    const category = categories[i % categories.length];

    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: Number(faker.commerce.price({ min: 500, max: 20000 })),
      stock: faker.number.int({ min: 0, max: 50 }),
      isActive: true,
      categoryId: category.id
    });
  }

  await prisma.product.createMany({ data: products });

  console.log("🛒 Products seeded");
}
