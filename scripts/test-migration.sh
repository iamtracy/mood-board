#!/bin/bash

DB_HOST=${DB_HOST:-'docker.for.mac.host.internal'} 
DB_PORT=${DB_PORT:-'5432'}                # Default to '5432' if not set
POSTGRES_USERNAME=${POSTGRES_USERNAME:-'moodyUser'} # Default to 'postgres' if not set
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-'SuperSecretPassword123'} # Default to 'your-password' if not set
POSTGRES_DB=${POSTGRES_DB:-'moodboard'} # Default to 'your-database' if not set
NODE_ENV=${NODE_ENV:-'production'} # Default to 'your-database' if not set

echo "Starting the PostgreSQL container..."
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "POSTGRES_USERNAME: $POSTGRES_USERNAME"
echo "POSTGRES_PASSWORD: $POSTGRES_PASSWORD"
echo "POSTGRES_DB: $POSTGRES_DB"
echo "NODE_ENV: $NODE_ENV"

docker run -d \
  --name mood-board \
  -e DB_HOST=$DB_HOST \
  -e DB_PORT=$DB_PORT \
  -e POSTGRES_USERNAME=$POSTGRES_USERNAME \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e POSTGRES_DB=$POSTGRES_DB \
  -p 3000:3000 \
  mood-board:latest