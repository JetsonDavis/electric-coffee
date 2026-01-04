#!/bin/bash

# Deploy Electric Coffee - Pull and run latest Docker image
# This script should be run on the server

set -e

# Configuration
IMAGE_NAME="jetsondavis/electric_coffee"
CONTAINER_NAME="electric-coffee"
VERSION="${1:-latest}"

echo "================================================"
echo "Deploying Electric Coffee"
echo "================================================"
echo "Image: ${IMAGE_NAME}:${VERSION}"
echo "Container: ${CONTAINER_NAME}"
echo "================================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Stop and remove existing container if it exists
echo ""
echo "Stopping existing container (if running)..."
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    docker stop ${CONTAINER_NAME} || true
    docker rm ${CONTAINER_NAME} || true
    echo "✓ Existing container stopped and removed"
else
    echo "No existing container found"
fi

# Remove old image if it exists (optional - saves disk space)
echo ""
echo "Removing old image (if exists)..."
if docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${IMAGE_NAME}:${VERSION}$"; then
    docker rmi ${IMAGE_NAME}:${VERSION} || true
    echo "✓ Old image removed"
else
    echo "No old image found"
fi

# Pull latest image
echo ""
echo "Pulling latest image from Docker Hub..."
docker pull ${IMAGE_NAME}:${VERSION}
echo "✓ Image pulled successfully"

# Create data directory if it doesn't exist
echo ""
echo "Setting up data directories..."
mkdir -p ./data
mkdir -p ./public/thumbnails
echo "✓ Data directories ready"

# Run the container
echo ""
echo "Starting new container..."
docker run -d \
  -p 3005:3005 \
  -p 8005:8005 \
  -v $(pwd)/data:/app/server/data \
  -v $(pwd)/public/thumbnails:/app/public/thumbnails \
  --name ${CONTAINER_NAME} \
  --restart unless-stopped \
  ${IMAGE_NAME}:${VERSION}

echo "✓ Container started successfully"

# Wait a moment for container to start
sleep 3

# Check if container is running
echo ""
echo "Checking container status..."
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "✓ Container is running"
    
    # Show container logs
    echo ""
    echo "Recent logs:"
    echo "================================================"
    docker logs --tail 20 ${CONTAINER_NAME}
    echo "================================================"
else
    echo "✗ Container failed to start"
    echo ""
    echo "Container logs:"
    docker logs ${CONTAINER_NAME}
    exit 1
fi

echo ""
echo "================================================"
echo "✓ Deployment Complete!"
echo "================================================"
echo "Application is running at:"
echo "  Frontend: http://localhost:3005"
echo "  Admin:    http://localhost:3005/admin"
echo "  API:      http://localhost:8005"
echo ""
echo "Useful commands:"
echo "  Stop:         docker stop ${CONTAINER_NAME}"
echo "  Restart:      docker restart ${CONTAINER_NAME}"
echo "  Remove:       docker stop ${CONTAINER_NAME} && docker rm ${CONTAINER_NAME}"
echo "================================================"
echo ""
echo "Tailing container logs (Ctrl+C to exit)..."
echo ""
docker logs -f ${CONTAINER_NAME}
