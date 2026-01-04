#!/bin/bash

# Build and push Electric Coffee Docker image to Docker Hub
# Usage: ./build-and-push.sh [version]
# Example: ./build-and-push.sh 1.0.0

set -e

# Configuration
IMAGE_NAME="electric_coffee"
DOCKER_USERNAME="${DOCKER_USERNAME:-jetsondavis}"

# Get version from argument or use 'latest'
VERSION="${1:-latest}"

echo "================================================"
echo "Building Electric Coffee Docker Image"
echo "================================================"
echo "Image: ${DOCKER_USERNAME}/${IMAGE_NAME}"
echo "Version: ${VERSION}"
echo "================================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if logged in to Docker Hub
if ! docker info | grep -q "Username"; then
    echo "Warning: You may not be logged in to Docker Hub."
    echo "Run 'docker login' if the push fails."
fi

# Build the image
echo ""
echo "Building Docker image..."
docker build -t ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} .

# Tag as latest if a specific version was provided
if [ "$VERSION" != "latest" ]; then
    echo ""
    echo "Tagging as latest..."
    docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
fi

# Push to Docker Hub
echo ""
echo "Pushing to Docker Hub..."
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}

if [ "$VERSION" != "latest" ]; then
    docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
fi

echo ""
echo "================================================"
echo "✓ Successfully built and pushed!"
echo "================================================"
echo "Image: ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
if [ "$VERSION" != "latest" ]; then
    echo "Also tagged as: ${DOCKER_USERNAME}/${IMAGE_NAME}:latest"
fi
echo ""
echo "To pull and run:"
echo "docker pull ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
echo "docker run -d -p 3005:3005 -p 8005:8005 \\"
echo "  -v \$(pwd)/data:/app/server/data \\"
echo "  -v \$(pwd)/public/thumbnails:/app/public/thumbnails \\"
echo "  --name electric-coffee \\"
echo "  ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
echo "================================================"
