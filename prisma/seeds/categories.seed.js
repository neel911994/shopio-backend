"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedCategories;
async function seedCategories(prisma) {
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
