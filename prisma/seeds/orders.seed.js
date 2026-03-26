"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedOrders;
const faker_1 = require("@faker-js/faker");
const client_1 = require("@prisma/client");
async function seedOrders(prisma) {
    const customers = await prisma.customer.findMany();
    const products = await prisma.product.findMany();
    if (customers.length === 0 || products.length === 0) {
        throw new Error("Customers or Products missing. Seed them first.");
    }
    for (let i = 0; i < 300; i++) {
        const customer = faker_1.faker.helpers.arrayElement(customers);
        const itemsCount = faker_1.faker.number.int({ min: 1, max: 5 });
        let totalAmount = 0;
        const orderItems = [];
        for (let j = 0; j < itemsCount; j++) {
            const product = faker_1.faker.helpers.arrayElement(products);
            const quantity = faker_1.faker.number.int({ min: 1, max: 3 });
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
                status: faker_1.faker.helpers.arrayElement([
                    client_1.OrderStatus.PENDING,
                    client_1.OrderStatus.PAID,
                    client_1.OrderStatus.SHIPPED,
                    client_1.OrderStatus.DELIVERED
                ]),
                totalAmount,
                createdAt: faker_1.faker.date.between({
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
