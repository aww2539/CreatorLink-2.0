#!/bin/bash

# Initial database setup script for the development container.
# Uses the files in .devcontainer/database/baseline 

echo "Applying baseline SQL files..."

for sql_file in ../database/baseline/*.sql; do
    echo "Applying $sql_file..."
    PGPASSWORD="postgres" psql -h localhost -p 5432 -U postgres -d creatorlink -f "$sql_file"
done

echo "Database initialization complete."
