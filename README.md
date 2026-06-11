# Take Home Test

**Disclaimer:** This project test was created with an opensource nest.js starter kit. 

---

## 🐳 Docker Setup

### create .env in the root project and copy/paste the variables below.
``` bash
  POSTGRES_USER=pius
  POSTGRES_PASSWORD=piuspius

  AUTH_DB=healthcare_auth
  SCHEDULE_DB=healthcare_schedule

```

### Using Docker Compose

```bash
#if run the container for the first time or make any changes, use --build
sudo docker-compose up --build

#if just want to run the existing images, remove --build
sudo docker-compose up
```

This will start:
- **auth_service** on `http://localhost:3001`
- **schedule_service** on `http://localhost:3002`
- **PostgreSQL** on `localhost:5433`
---