#!/bin/bash

LOG_FILE="/app/logs/migrate-and-start.log"

mkdir -p /app/logs

log_message() {
    local MESSAGE="$1"
    echo "$(date +'%Y-%m-%d %H:%M:%S') - $MESSAGE" >> "$LOG_FILE"
}

log_message "Starting migration and application startup process..."

log_message "Running database migration..."

npx typeorm-ts-node-commonjs migration:run -d /app/db/typeorm.config.ts

MIGRATION_STATUS=$?

if [ $MIGRATION_STATUS -ne 0 ]; then
    log_message "ERROR: Migration failed with exit code $MIGRATION_STATUS."
    exit $MIGRATION_STATUS
else
    log_message "Migration completed successfully."
fi

log_message "Starting the application..."

node dist/api/main
APP_STATUS=$?

if [ $APP_STATUS -ne 0 ]; then
    log_message "ERROR: Application failed to start with exit code $APP_STATUS."
    exit $APP_STATUS
else
    log_message "Application started successfully."
fi

log_message "Process completed successfully."
