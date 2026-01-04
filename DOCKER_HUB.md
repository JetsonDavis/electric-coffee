# Docker Hub Deployment Guide

## Prerequisites

1. **Docker Hub Account**: Create an account at https://hub.docker.com
2. **Docker Login**: Login to Docker Hub from your terminal

```bash
docker login
```

Enter your Docker Hub username and password when prompted.

## Configuration

Before running the build script, set your Docker Hub username:

```bash
export DOCKER_USERNAME="your-dockerhub-username"
```

Or edit the `build-and-push.sh` script and replace `your-dockerhub-username` with your actual username.

## Building and Pushing

### Push Latest Version

```bash
./build-and-push.sh
```

This will build and push the image as `your-username/electric_coffee:latest`

### Push Specific Version

```bash
./build-and-push.sh 1.0.0
```

This will build and push:
- `your-username/electric_coffee:1.0.0`
- `your-username/electric_coffee:latest` (also tagged)

## Pulling and Running from Docker Hub

Once pushed, anyone can pull and run your image:

```bash
# Pull the image
docker pull your-username/electric_coffee:latest

# Run the container
docker run -d \
  -p 3005:3005 \
  -p 3001:3001 \
  -v $(pwd)/data:/app/server/data \
  -v $(pwd)/public/thumbnails:/app/public/thumbnails \
  --name electric-coffee \
  your-username/electric_coffee:latest
```

## Image Details

- **Image Name**: `electric_coffee`
- **Ports**: 
  - 3005 (Frontend)
  - 3001 (Backend API)
- **Volumes**:
  - `/app/server/data` - SQLite database
  - `/app/public/thumbnails` - Video thumbnails

## Versioning Strategy

### Semantic Versioning

Use semantic versioning (MAJOR.MINOR.PATCH):

```bash
# Major release (breaking changes)
./build-and-push.sh 2.0.0

# Minor release (new features)
./build-and-push.sh 1.1.0

# Patch release (bug fixes)
./build-and-push.sh 1.0.1
```

### Development Builds

For development/testing builds:

```bash
./build-and-push.sh dev
./build-and-push.sh staging
```

## Automated Builds

You can integrate this script into CI/CD pipelines:

### GitHub Actions Example

```yaml
name: Build and Push Docker Image

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and Push
        run: |
          export DOCKER_USERNAME=${{ secrets.DOCKER_USERNAME }}
          ./build-and-push.sh ${GITHUB_REF#refs/tags/v}
```

## Troubleshooting

### Authentication Failed

```bash
# Re-login to Docker Hub
docker login
```

### Image Too Large

The image includes Node.js and all dependencies. To reduce size:
- Use multi-stage builds
- Remove development dependencies
- Optimize layer caching

### Push Denied

Ensure you have write access to the repository on Docker Hub. The repository will be created automatically on first push if it doesn't exist.

## Security Notes

- Never commit Docker Hub credentials to version control
- Use environment variables or secrets management
- Consider using Docker Hub access tokens instead of passwords
- Regularly update base images for security patches
