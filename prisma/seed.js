"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const users_seed_1 = __importDefault(require("./seeds/users.seed"));
const categories_seed_1 = __importDefault(require("./seeds/categories.seed"));
const products_seed_1 = __importDefault(require("./seeds/products.seed"));
const customers_seed_1 = __importDefault(require("./seeds/customers.seed"));
const orders_seed_1 = __importDefault(require("./seeds/orders.seed"));
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log("🌱 Seeding database...");
    await (0, users_seed_1.default)(prisma);
    await (0, categories_seed_1.default)(prisma);
    await (0, products_seed_1.default)(prisma);
    await (0, customers_seed_1.default)(prisma);
    await (0, orders_seed_1.default)(prisma);
    console.log("🌱 Database seeding completed successfully.");
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
