#!/bin/bash

# Default values for environment variables if not set
: "${CONTAINER_NAME:=postgres-db}"
: "${POSTGRES_USER:=postgres}"  # Default username for PostgreSQL
: "${POSTGRES_PASSWORD:=postgres}"  # Default password for PostgreSQL
: "${DB_HOST:=localhost}"  # Host for PostgreSQL
: "${DATABASE_PORT:=5432}"  # Port for PostgreSQL
: "${POSTGRES_DB:=mood-board}"  # Default database name for PostgreSQL

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

# Start PostgreSQL container
start_postgres() {
  echo "Starting PostgreSQL container..."
  
  # Ensure the environment variables are not empty before using them
  if [[ -z "$POSTGRES_USER" || -z "$POSTGRES_PASSWORD" || -z "$DATABASE_PORT" ]]; then
    echo "Error: Missing necessary environment variables."
    exit 1
  fi

  # Run the PostgreSQL container with the proper environment variables
  docker run --name $CONTAINER_NAME \
    -e POSTGRES_USER=$POSTGRES_USER \
    -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    -e POSTGRES_DB=$POSTGRES_DB \
    -d -p $DATABASE_PORT:$DATABASE_PORT \
    postgres:latest

  echo "PostgreSQL is now running on $DB_HOST:$DATABASE_PORT with user $POSTGRES_USER"
}

# Stop PostgreSQL container
stop_postgres() {
  echo "Stopping PostgreSQL container..."
  docker stop $CONTAINER_NAME
  echo "PostgreSQL container stopped."
}

# Remove PostgreSQL container and data volume
remove_postgres() {
  echo "Removing PostgreSQL container and data volume..."
  docker rm $CONTAINER_NAME
  docker volume rm postgres-data
  echo "PostgreSQL container and data volume removed."
}

# Main script logic
case "$1" in
  start)
    start_postgres
    ;;
  stop)
    stop_postgres
    ;;
  remove)
    remove_postgres
    ;;
  *)
    echo "Usage: $0 {start|stop|remove}"
    exit 1
    ;;
esac
