# Shopio Backend

REST API for the Shopio e-commerce admin portal. Manages products, orders, customers, and provides dashboard KPIs with role-based access control.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | >=20.19.0 |
| Language | TypeScript | ^5.9.3 |
| Framework | Express.js | ^5.2.1 |
| ORM | Prisma | ^7.2.0 |
| Database | PostgreSQL | - |
| Auth | JWT + bcryptjs | - |

---

## Features

- **Authentication** — JWT access + refresh token system with secure HttpOnly cookies
- **Role-Based Access Control** — `ADMIN` and `STAFF` roles enforced at route level
- **Product Management** — Create, update, filter by category/stock status, paginated listing
- **Order Management** — Full lifecycle tracking (PENDING → PAID → SHIPPED → DELIVERED / CANCELLED)
- **Customer Management** — Customer profiles with full order history
- **Category Management** — Product categories with product counts
- **Dashboard KPIs** — Revenue trends, order metrics, top products, low stock alerts, month-over-month comparisons

---

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/login` | Login with email & password | No |
| POST | `/refresh` | Refresh access token | No |
| POST | `/logout` | Logout (clears cookie) | No |

### Users — `/api/users`
| Method | Endpoint | Description | Auth | Admin |
|---|---|---|---|---|
| GET | `/` | List all users | Yes | - |
| GET | `/:id` | Get user by ID | Yes | - |
| POST | `/` | Create user | Yes | Yes |
| DELETE | `/:id` | Delete user | Yes | Yes |

### Products — `/api/products`
| Method | Endpoint | Description | Auth | Admin |
|---|---|---|---|---|
| GET | `/stats` | Product statistics | Yes | - |
| GET | `/` | List products (filter: `categoryId`, `stockFilter`, `search`, `page`, `limit`) | Yes | - |
| GET | `/:id` | Get product by ID | Yes | - |
| POST | `/` | Create product | Yes | Yes |
| PATCH | `/:id` | Update stock / active status | Yes | Yes |

### Categories — `/api/categories`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | List all categories with product counts | No |
| GET | `/:id` | Get category with products | No |
| POST | `/` | Create category | No |

### Customers — `/api/customers`
| Method | Endpoint | Description | Auth | Admin |
|---|---|---|---|---|
| GET | `/` | List customers (filter: `search`, `page`, `limit`) | Yes | - |
| GET | `/:id` | Get customer with order history | Yes | - |
| PATCH | `/:id` | Update customer phone | Yes | Yes |

### Orders — `/api/orders`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/stats` | Order statistics | Yes |
| GET | `/` | List orders (filter: `status`, `customerName`, `startDate`, `endDate`, `page`, `limit`) | Yes |
| GET | `/:id` | Get order with full details | Yes |
| PATCH | `/:id` | Update order status | Yes |

### Dashboard — `/api/dashboard`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | Comprehensive KPIs | Yes |

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |

---

## Data Models

- **User** — `id`, `name`, `email`, `password`, `role` (ADMIN/STAFF), `status` (ACTIVE/INACTIVE)
- **Product** — `id`, `name`, `description`, `price`, `stock`, `isActive`, `categoryId`
- **Category** — `id`, `name` → has many Products
- **Customer** — `id`, `name`, `email`, `phone` → has many Orders
- **Order** — `id`, `customerId`, `status`, `totalAmount` → has many OrderItems
- **OrderItem** — `id`, `orderId`, `productId`, `quantity`, `price`

---

## Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20.19.0
- [PostgreSQL](https://www.postgresql.org/) (running locally or via Docker)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Steps

**1. Clone the repository**
```bash
git clone <repo-url>
cd shopio-backend
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the root:
```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/shopio
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**4. Run database migrations**
```bash
npm run prisma:migrate
```

**5. Seed the database**
```bash
npm run prisma:seed
```

**6. Start development server**
```bash
npm run dev
```

Server runs at `http://localhost:4000`.

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start dev server with hot reload |
| `build` | `npm run build` | Compile TypeScript to `dist/` |
| `start` | `npm start` | Run compiled production server |
| `prisma:migrate` | `npm run prisma:migrate` | Apply pending DB migrations |
| `prisma:seed` | `npm run prisma:seed` | Seed DB with sample data |

---

## Project Structure

```
shopio-backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── routes/           # Route definitions
│   ├── services/         # Business logic
│   ├── middlewares/      # Auth & role guards
│   ├── utils/            # JWT, password, Prisma client
│   ├── app.ts            # Express app config
│   └── server.ts         # Entry point
├── prisma/
│   ├── schema.prisma     # DB schema
│   ├── seed.ts           # Seed entry point
│   └── seeds/            # Per-entity seed files
├── dist/                 # Compiled output (auto-generated)
├── tsconfig.json
└── package.json
```
