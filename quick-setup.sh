#!/bin/bash

# ISP Billing System - Quick Setup
# This script creates all necessary files automatically

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 ISP Billing System - Quick Setup"
echo "===================================="
echo ""

# Step 1: Create backend structure
echo "📁 Creating backend structure..."
mkdir -p backend/src/{routes,middleware,config}

# Step 2: Create all necessary files
echo "📝 Creating configuration files..."

# docker-compose.yml
cat > docker-compose.yml << 'DOCKER_EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: isp_billing_db
    restart: always
    environment:
      POSTGRES_USER: ispbilling
      POSTGRES_PASSWORD: ispbilling123
      POSTGRES_DB: isp_billing
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - isp_network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: isp_billing_backend
    restart: always
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgresql://ispbilling:ispbilling123@postgres:5432/isp_billing
      JWT_SECRET: your_super_secret_jwt_key_change_this
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    networks:
      - isp_network

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: isp_billing_frontend
    restart: always
    environment:
      VITE_API_URL: http://localhost:3000/api
    ports:
      - "8080:80"
    depends_on:
      - backend
    networks:
      - isp_network

volumes:
  postgres_data:

networks:
  isp_network:
    driver: bridge
DOCKER_EOF

# Frontend Dockerfile
cat > Dockerfile << 'FRONT_EOF'
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
FRONT_EOF

# nginx.conf
cat > nginx.conf << 'NGINX_EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_EOF

# Backend package.json
cat > backend/package.json << 'BACK_PKG_EOF'
{
  "name": "isp-billing-backend",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1",
    "socket.io": "^4.6.2",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "morgan": "^1.10.0"
  }
}
BACK_PKG_EOF

# Backend Dockerfile
cat > backend/Dockerfile << 'BACK_DOCK_EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
BACK_DOCK_EOF

# .env files
cat > backend/.env << 'BACK_ENV_EOF'
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://ispbilling:ispbilling123@postgres:5432/isp_billing
JWT_SECRET=your_super_secret_jwt_key_change_this
BACK_ENV_EOF

cat > .env << 'FRONT_ENV_EOF'
VITE_API_URL=http://localhost:3000/api
FRONT_ENV_EOF

echo -e "${GREEN}✅ Configuration files created${NC}"

# Install axios if not already installed
echo "📦 Installing dependencies..."
if ! grep -q "axios" package.json; then
    npm install axios socket.io-client --save
fi

# Download backend files from GitHub gist (you need to create these)
echo "📥 Setting up backend files..."
echo "⚠️  Please manually copy the backend route files from the artifacts above"
echo "    Required files:"
echo "    - backend/init.sql"
echo "    - backend/src/server.js"
echo "    - backend/src/config/database.js"
echo "    - backend/src/middleware/auth.js"
echo "    - backend/src/routes/*.js (8 files)"
echo ""

# Create src/lib/api.ts placeholder
mkdir -p src/lib
cat > src/lib/api.ts << 'API_EOF'
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
};

export const customerAPI = {
  getAll: (params?: any) => api.get('/customers', { params }),
  create: (data: any) => api.post('/customers', data),
  update: (id: number, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: number) => api.delete(`/customers/${id}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
API_EOF

echo -e "${GREEN}✅ API client created${NC}"
echo ""
echo "=========================================="
echo -e "${YELLOW}⚠️  NEXT STEPS:${NC}"
echo "=========================================="
echo ""
echo "1. Copy all backend files from artifacts above"
echo "2. Run: docker-compose up -d --build"
echo "3. Access: http://localhost:8080"
echo "4. Login: admin@ispbilling.com / admin123"
echo ""
echo "Need help? Check INSTALL.md for detailed instructions"
echo ""
