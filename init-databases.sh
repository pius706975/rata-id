#!/bin/bash
set -e

# Create auth database
PGPASSWORD=$POSTGRES_PASSWORD psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d postgres <<-EOSQL
  CREATE DATABASE healthcare_auth;
EOSQL

# Create schedule database
PGPASSWORD=$POSTGRES_PASSWORD psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d postgres <<-EOSQL
  CREATE DATABASE healthcare_schedule;
EOSQL

echo "✓ Databases created: healthcare_auth, healthcare_schedule"
