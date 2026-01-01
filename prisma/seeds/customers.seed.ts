import { faker } from "@faker-js/faker";
import type { PrismaClient } from "@prisma/client";

export default async function seedCustomers(prisma: PrismaClient) {
  const customers = [];

  for (let i = 0; i < 100; i++) {
    customers.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number()
    });
  }

  await prisma.customer.createMany({
    data: customers,
    skipDuplicates: true
  });

  console.log("👥 Customers seeded");
}
