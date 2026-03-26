"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedUsers;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function seedUsers(prisma) {
    const users = [
        {
            name: "Shopio Admin",
            email: "admin@shopio.com",
            role: "ADMIN",
            rawPassword: "Admin@123"
        },
        {
            name: "Shopio Staff",
            email: "staff@shopio.com",
            role: "STAFF",
            rawPassword: "Staff@123"
        }
        // "name": "New User", "email": "newuser@test.com", "password": "Test@123", "role": "STAFF"}
    ];
    for (const user of users) {
        const hashedPassword = await bcryptjs_1.default.hash(user.rawPassword, 10);
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
                role: user.role, // Assuming role enum matches
                status: "ACTIVE"
            }
        });
    }
    console.log("👤 Admin and Staff users seeded with different passwords");
}
