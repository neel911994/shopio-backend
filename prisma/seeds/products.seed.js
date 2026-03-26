"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedProducts;
const faker_1 = require("@faker-js/faker");
async function seedProducts(prisma) {
    const categories = await prisma.category.findMany();
    const products = [];
    for (let i = 0; i < 100; i++) {
        const category = categories[i % categories.length];
        products.push({
            name: faker_1.faker.commerce.productName(),
            description: faker_1.faker.commerce.productDescription(),
            price: Number(faker_1.faker.commerce.price({ min: 500, max: 20000 })),
            stock: faker_1.faker.number.int({ min: 0, max: 50 }),
            isActive: true,
            categoryId: category.id
        });
    }
    await prisma.product.createMany({ data: products });
    console.log("🛒 Products seeded");
}
