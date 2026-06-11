# Auth Service

### Prerequisites

- **Node.js** >= 20.x
- **PostgreSQL** >= 16.x
- **Docker** (for containerized setup)

### Local Development Setup

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Environment Configuration

Create `.env` file in root with:
```env
PORT=3001

# POSTGRES
POSTGRES_USER=pius
POSTGRES_PASSWORD=piuspius
POSTGRES_DB=healthcare_auth

# Nest run locally
DB_HOST=localhost
# Nest run in docker, change host to database container name
# DB_HOST=postgres
DB_PORT=5432
DB_SCHEMA=public


DATABASE_URL=postgresql://pius:piuspius@localhost:5432/healthcare_auth?schema=public&sslmode=prefer
JWT_ACCESS_SECRET=nestjsPrismaAccessSecret
JWT_REFRESH_SECRET=nestjsPrismaRefreshSecret

```

#### 3. Setup Database
```bash
npm run migrate
```

#### 4. Start Development Server
```bash
npm run start:dev
```

Server will run on: **http://localhost:3001**

GraphQL Playground: **http://localhost:3001/graphql**


## Project Structure

```
auth_service/
├── src/
│   ├── auth/                 # Authentication module
│   │   ├── auth.service.ts   # Auth business logic
│   │   ├── auth.resolver.ts  # GraphQL resolvers
│   │   ├── jwt.strategy.ts   # JWT strategy
│   │   ├── gql-auth.guard.ts # GraphQL auth guard
│   │   ├── password.service.ts
│   │   └── dto/              # Data transfer objects
│   ├── users/                # User module
│   │   ├── users.resolver.ts
│   │   ├── users.service.ts
│   │   └── models/
│   ├── common/               # Shared utilities
│   │   ├── configs/          # Configuration
│   │   ├── decorators/       # Custom decorators
│   │   └── models/           # Base models
│   ├── main.ts               # Application entry point
│   └── app.module.ts         # Root module
├── prisma/
│   ├── schema.prisma         # ORM schema definition
│   └── migrations/           # Database migrations
├── Dockerfile                # Docker image config
├── docker-compose.yml        # Docker Compose config
└── package.json
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build the application |
| `npm run start` | Run production build |
| `npm run start:dev` | Run development mode (watch) |
| `npm run start:prod` | Run production mode |
| `npm run migrate` | Run pending Prisma migrations |
| `npm run migrate:reset` | Reset database to clean state |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Check error TS

---


## Troubleshooting

### Token Validation Error: "Invalid token"
- **Cause:** Token has expired (default: 15 minutes)
- **Solution:** Generate a new token by logging in again

### Database Connection Error
- **Cause:** PostgreSQL not running or wrong credentials
- **Solution:** Check `.env` DATABASE_URL and PostgreSQL service status

### Migration Failed
- **Cause:** Database schema mismatch
- **Solution:** Run `npm run migrate:reset` (⚠️ Warning: Clears all data)

---