# Server Deployment Guide

## Overview

This guide covers deploying the Electric Coffee application to a server using Docker.

## Prerequisites

1. **Docker installed** on the server
2. **Internet connection** to pull from Docker Hub
3. **Ports available**: 3005 (frontend) and 8005 (backend)

## Deployment Script

The `deploy.sh` script automates the entire deployment process:

1. Stops any running container
2. Removes the old container
3. Removes the old image (to save space)
4. Pulls the latest image from Docker Hub
5. Creates necessary data directories
6. Starts the new container with proper volume mounts

## Quick Deployment

### Deploy Latest Version

```bash
./deploy.sh
```

This pulls and runs `jetsondavis/electric_coffee:latest`

### Deploy Specific Version

```bash
./deploy.sh 1.0.0
```

This pulls and runs `jetsondavis/electric_coffee:1.0.0`

## Manual Deployment

If you prefer to deploy manually:

```bash
# Stop and remove existing container
docker stop electric-coffee
docker rm electric-coffee

# Remove old image (optional)
docker rmi jetsondavis/electric_coffee:latest

# Pull latest image
docker pull jetsondavis/electric_coffee:latest

# Create data directories
mkdir -p ./data
mkdir -p ./public/thumbnails

# Run the container
docker run -d \
  -p 3005:3005 \
  -p 8005:8005 \
  -v $(pwd)/data:/app/server/data \
  -v $(pwd)/public/thumbnails:/app/public/thumbnails \
  --name electric-coffee \
  --restart unless-stopped \
  jetsondavis/electric_coffee:latest
```

## Server Setup

### Initial Server Setup

1. **Install Docker**:
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
```

2. **Create deployment directory**:
```bash
mkdir -p ~/electric-coffee
cd ~/electric-coffee
```

3. **Copy deployment script**:
```bash
# Copy deploy.sh to the server
scp deploy.sh user@server:~/electric-coffee/
```

4. **Run deployment**:
```bash
cd ~/electric-coffee
./deploy.sh
```

## Continuous Deployment

### Webhook Setup

You can set up automatic deployments when you push to Docker Hub:

1. **Install webhook listener** (e.g., webhook or adnanh/webhook)
2. **Configure webhook** to run `deploy.sh` on trigger
3. **Set up Docker Hub webhook** to call your server endpoint

### Example webhook configuration:

```json
[
  {
    "id": "deploy-electric-coffee",
    "execute-command": "/home/user/electric-coffee/deploy.sh",
    "command-working-directory": "/home/user/electric-coffee",
    "response-message": "Deploying Electric Coffee..."
  }
]
```

## Monitoring

### View Logs

```bash
# Follow logs in real-time
docker logs -f electric-coffee

# View last 100 lines
docker logs --tail 100 electric-coffee
```

### Check Status

```bash
# Check if container is running
docker ps | grep electric-coffee

# Check container health
docker inspect electric-coffee
```

### Resource Usage

```bash
# View resource usage
docker stats electric-coffee
```

## Maintenance

### Update to Latest Version

```bash
./deploy.sh
```

### Rollback to Previous Version

```bash
./deploy.sh 1.0.0
```

### Backup Database

```bash
# Create timestamped backup
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz data/
```

### Restore Database

```bash
# Stop container
docker stop electric-coffee

# Restore backup
tar -xzf backup-20240103-120000.tar.gz

# Start container
docker start electric-coffee
```

### Clean Up Old Images

```bash
# Remove unused images
docker image prune -a

# Remove specific old version
docker rmi jetsondavis/electric_coffee:old-version
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs electric-coffee

# Check if ports are in use
sudo lsof -i :3005
sudo lsof -i :8005

# Try running with different ports
docker run -d \
  -p 8080:3005 \
  -p 8081:8005 \
  -v $(pwd)/data:/app/server/data \
  --name electric-coffee \
  jetsondavis/electric_coffee:latest
```

### Database Issues

```bash
# Check database file permissions
ls -la data/

# Fix permissions if needed
chmod 755 data/
chmod 644 data/videos.db
```

### Network Issues

```bash
# Check if container can reach internet
docker exec electric-coffee ping -c 3 google.com

# Check container network
docker network inspect bridge
```

## Security Considerations

1. **Firewall**: Only expose necessary ports (3005, 8005)
2. **SSL/TLS**: Use a reverse proxy (nginx, Caddy) for HTTPS
3. **Updates**: Regularly update the Docker image
4. **Backups**: Automate database backups
5. **Access Control**: Restrict admin page access

## Production Recommendations

### Use Reverse Proxy

Example nginx configuration:

```nginx
server {
    listen 80;
    server_name electriccoffee.example.com;

    location / {
        proxy_pass http://localhost:3005;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8005;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Set Up SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d electriccoffee.example.com
```

### Automated Backups

Add to crontab:

```bash
# Backup database daily at 2 AM
0 2 * * * cd /home/user/electric-coffee && tar -czf backups/backup-$(date +\%Y\%m\%d).tar.gz data/
```

## Support

For issues or questions:
- Check Docker logs: `docker logs electric-coffee`
- Verify image: `docker images | grep electric_coffee`
- Test connectivity: `curl http://localhost:3005`
