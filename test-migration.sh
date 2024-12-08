#!/bin/bash

# Set the environment variables (replace these with actual values or export from your secrets management service)
DB_HOST=${DB_HOST:-'postgres-db'}           # Default to 'localhost' if not set
DB_PORT=${DB_PORT:-'5432'}                # Default to '5432' if not set
POSTGRES_USERNAME=${POSTGRES_USERNAME:-'postgres'} # Default to 'postgres' if not set
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-'postgres'} # Default to 'your-password' if not set
POSTGRES_DB=${POSTGRES_DB:-'moodboard'} # Default to 'your-database' if not set

echo "Starting the PostgreSQL container..."
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "POSTGRES_USERNAME: $POSTGRES_USERNAME"
echo "POSTGRES_PASSWORD: $POSTGRES_PASSWORD"
echo "POSTGRES_DB: $POSTGRES_DB"

# Run the Docker container with the environment variables
docker run -d \
  --name mood-board \
  -e DB_HOST=$DB_HOST \
  -e DB_PORT=$DB_PORT \
  -e POSTGRES_USERNAME=$POSTGRES_USERNAME \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e POSTGRES_DB=$POSTGRES_DB \
  -p 3000:3000 \
  mood-board:latest