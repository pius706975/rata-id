# Schedule Service Documentation

### Prerequisites

- **Node.js** >= 20.x
- **PostgreSQL** >= 16.x
- **Auth Service** running on port 3001
- **Docker** (for containerized setup)

### Local Development Setup

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Environment Configuration

Create `.env` file in root with:
```bash
  PORT=3002

  # POSTGRES
  POSTGRES_USER=pius
  POSTGRES_PASSWORD=piuspius
  POSTGRES_DB=healthcare_schedule

  # Nest run locally
  DB_HOST=localhost
  # Nest run in docker, change host to database container name
  # DB_HOST=postgres
  DB_PORT=5432
  DB_SCHEMA=public

  DATABASE_URL=postgresql://pius:piuspius@localhost:5432/healthcare_schedule?schema=public&sslmode=prefer
  AUTH_SERVICE_URL=http://localhost:3001/graphql

  MAILER_HOST=smtp.gmail.com
  MAILER_PORT=587
  MAILER_EMAIL=<MAILER_EMAIL>
  MAILER_PASSWORD=<MAILER_PASSWORD>
```

#### 3. Setup Database
```bash
npm run migrate
```

#### 4. Start Development Server
```bash
npm run start:dev
```

Server will run on: **http://localhost:3002**

GraphQL Playground: **http://localhost:3002/graphql**

---

## 📁 Project Structure

```
schedule_service/
├── src/
│   ├── doctors/               # Doctor module
│   │   ├── doctors.service.ts # Doctor business logic
│   │   ├── doctors.resolver.ts# GraphQL resolvers
│   │   ├── doctors.module.ts  # Feature module
│   │   ├── models/
│   │   │   ├── doctor.model.ts
│   │   │   └── doctor-list.model.ts
│   │   └── dto/              # Data transfer objects
│   │       ├── create-doctor.input.ts
│   │       ├── update-doctor.input.ts
│   │       └── doctor-pagination.args.ts
|   ├── other_modules         # customer and schedule
│   ├── common/               # Shared utilities
│   │   ├── guards/
│   │   │   └── http-bearer.guard.ts # Cross-service auth
│   │   ├── configs/          # Configuration
│   │   └── models/           # Base models
│   ├── main.ts               # Application entry point
│   ├── app.module.ts         # Root module
│   ├── app.service.ts        # Service
│   ├── app.resolver.ts       # Resolver
│   └── gql-config.service.ts # GraphQL config
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

## 🐛 Troubleshooting

### Unauthorized Error: "Invalid token or missing Authorization header"
- **Cause:** Token expired, missing, or invalid format
- **Solution:** Get new token from Auth Service (http://localhost:3001/graphql)

### Auth Service Connection Error
- **Cause:** Auth Service not running or unreachable
- **Solution:** Start Auth Service on port 3001 and check `AUTH_SERVICE_URL` in `.env`

### Database Connection Error
- **Cause:** PostgreSQL not running or wrong credentials
- **Solution:** Check `.env` DATABASE_URL and PostgreSQL service status

### Migration Failed
- **Cause:** Database schema mismatch
- **Solution:** Run `npm run migrate:reset` (⚠️ Warning: Clears all data)

---
