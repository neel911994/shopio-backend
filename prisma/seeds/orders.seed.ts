import { faker } from "@faker-js/faker";
import { PrismaClient, OrderStatus } from "@prisma/client";

export default async function seedOrders(prisma: PrismaClient): Promise<void> {
  const customers = await prisma.customer.findMany(); 
  const products = await prisma.product.findMany();

  if (customers.length === 0 || products.length === 0) {
    throw new Error("Customers or Products missing. Seed them first.");
  }

  for (let i = 0; i < 300; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const itemsCount = faker.number.int({ min: 1, max: 5 });

    let totalAmount = 0;

    const orderItems: {
      productId: string;
      quantity: number;
      price: number;
    }[] = [];

    for (let j = 0; j < itemsCount; j++) {
      const product = faker.helpers.arrayElement(products);
      const quantity = faker.number.int({ min: 1, max: 3 });

      totalAmount += Number(product.price) * quantity;

      orderItems.push({
        productId: product.id,
        quantity,
        price: product.price
      });
    }

    await prisma.order.create({
      data: {
        customerId: customer.id,
        status: faker.helpers.arrayElement([
          OrderStatus.PENDING,
          OrderStatus.PAID,
          OrderStatus.SHIPPED,
          OrderStatus.DELIVERED
        ]),
        totalAmount,
        createdAt: faker.date.between({
          from: new Date("2024-01-01"),
          to: new Date()
        }),
        items: {
          create: orderItems
        }
      }
    });
  }

  console.log("📑 Orders & OrderItems seeded");
}
