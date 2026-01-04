FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Build the frontend
RUN npm run build

# Create data directory for SQLite database
RUN mkdir -p /app/server/data

# Expose ports (frontend on 3005, backend on 3001)
EXPOSE 3005 3001

# Start both servers
CMD sh -c "node server/index.js & npm run preview -- --host 0.0.0.0 --port 3005 && wait"
