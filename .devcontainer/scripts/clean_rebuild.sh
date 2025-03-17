#!/bin/bash

PROJECT_NAME="creatorlink-v2"

echo "Stopping and removing containers for project: $PROJECT_NAME..."
docker-compose down -v

<<<<<<< HEAD
echo "Removing unused images related to this project..."
docker images --filter "dangling=true" --format "{{.ID}}" | xargs -r docker rmi
docker images | grep "$PROJECT_NAME" | awk '{print $3}' | xargs -r docker rmi

echo "Rebuilding containers from scratch..."
docker-compose build --no-cache

echo "Starting containers..."
=======
echo "🧹 Removing unused images related to this project..."
docker images --filter "dangling=true" --format "{{.ID}}" | xargs -r docker rmi
docker images | grep "$PROJECT_NAME" | awk '{print $3}' | xargs -r docker rmi

echo "🔨 Rebuilding containers from scratch..."
docker-compose build --no-cache

echo "🚢 Starting containers..."
>>>>>>> 04207854620ba0d757205727eb093a98ea550ef5
docker-compose up -d

echo "Docker environment for $PROJECT_NAME is ready!"
