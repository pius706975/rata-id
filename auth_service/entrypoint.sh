#!/bin/sh
set -e

echo "Waiting for database to be ready..."
# Wait for postgres
timeout 60 bash -c 'until nc -z postgres 5432; do sleep 1; done' || true

echo "Running database migrations..."
npm run db:migrate -- --skip-generate || true

echo "Starting application..."
exec node dist/main
