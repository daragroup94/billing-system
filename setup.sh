#!/bin/bash

# ISP Billing System - Complete Setup Script
# Author: Assistant
# Description: Setup lengkap aplikasi ISP Billing dengan Docker

set -e

echo "🚀 ISP Billing System - Complete Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
echo ""

# Create backend directory structure
echo "📁 Creating backend directory structure..."
mkdir -p backend/src/{controllers,models,routes,middleware,utils,services,config}

# Create .env file for backend
echo "📝 Creating environment files..."
cat > backend/.env << 'EOF'
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://ispbilling:ispbilling123@postgres:5432/isp_billing
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_$(openssl rand -hex 32)
WHATSAPP_API_KEY=your_whatsapp_api_key_here
EOF

# Create .env file for frontend
cat > .env << 'EOF'
VITE_API_URL=http://localhost:3000/api
EOF

echo -e "${GREEN}✅ Environment files created${NC}"
echo ""

# Generate hashed password for default admin
echo "🔐 Generating admin password hash..."
ADMIN_PASSWORD_HASH=$(node -e "console.log(require('bcryptjs').hashSync('admin123', 10))")

# Update init.sql with proper password hash
echo "📝 Updating database initialization script..."
sed -i "s/\$2a\$10\$YourHashedPasswordHere/$ADMIN_PASSWORD_HASH/g" backend/init.sql 2>/dev/null || \
sed -i '' "s/\$2a\$10\$YourHashedPasswordHere/$ADMIN_PASSWORD_HASH/g" backend/init.sql 2>/dev/null || true

echo -e "${GREEN}✅ Database script updated${NC}"
echo ""

# Build and start containers
echo "🐳 Building and starting Docker containers..."
echo "This may take a few minutes on first run..."
echo ""

docker-compose down -v 2>/dev/null || true
docker-compose up -d --build

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ All services are running!${NC}"
else
    echo -e "${RED}❌ Some services failed to start. Check logs with: docker-compose logs${NC}"
    exit 1
fi

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "📋 Service URLs:"
echo "   Frontend:  http://localhost:8080"
echo "   Backend:   http://localhost:3000"
echo "   Database:  localhost:5432"
echo ""
echo "🔑 Default Login Credentials:"
echo "   Email:     admin@ispbilling.com"
echo "   Password:  admin123"
echo ""
echo "⚠️  IMPORTANT: Change the default password after first login!"
echo ""
echo "📝 Useful Commands:"
echo "   Stop services:     docker-compose stop"
echo "   Start services:    docker-compose start"
echo "   View logs:         docker-compose logs -f"
echo "   Restart:           docker-compose restart"
echo "   Remove all:        docker-compose down -v"
echo ""
echo "📚 Documentation:"
echo "   API Docs:  http://localhost:3000/api"
echo ""
echo -e "${GREEN}✨ Happy billing! ✨${NC}"
