"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedCustomers;
const faker_1 = require("@faker-js/faker");
async function seedCustomers(prisma) {
    const customers = [];
    for (let i = 0; i < 100; i++) {
        customers.push({
            name: faker_1.faker.person.fullName(),
            email: faker_1.faker.internet.email(),
            phone: faker_1.faker.phone.number()
        });
    }
    await prisma.customer.createMany({
        data: customers,
        skipDuplicates: true
    });
    console.log("👥 Customers seeded");
}
