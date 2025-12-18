# 🚀 ISP Billing System - Installation Guide

Complete installation guide untuk ISP Billing System dengan Docker Compose.

## 📋 Requirements

- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Node.js** >= 18 (untuk development)
- **Git**
- Minimal 2GB RAM
- Minimal 5GB disk space

## 🔧 Installation Steps

### 1. Clone atau Download Project

```bash
cd ~/smooth-billing-blue
```

### 2. Buat File Structure Backend

```bash
# Buat folder structure
mkdir -p backend/src/{controllers,models,routes,middleware,utils,services,config}
```

### 3. Copy Semua File Backend

Buat file-file berikut di folder `backend/`:

#### backend/package.json
```json
{
  "name": "isp-billing-backend",
  "version": "1.0.0",
  "description": "ISP Billing System Backend API",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
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
    "redis": "^4.6.7",
    "axios": "^1.6.0",
    "nodemailer": "^6.9.7",
    "multer": "^1.4.5-lts.1",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

#### backend/Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

#### backend/.env
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://ispbilling:ispbilling123@postgres:5432/isp_billing
JWT_SECRET=your_super_secret_jwt_key_change_this
WHATSAPP_API_KEY=your_whatsapp_api_key_here
```

### 4. Copy Semua File Routes

Copy file-file dari artifact sebelumnya ke folder:
- `backend/src/routes/auth.js`
- `backend/src/routes/customers.js`
- `backend/src/routes/invoices.js`
- `backend/src/routes/payments.js`
- `backend/src/routes/packages.js`
- `backend/src/routes/notifications.js`
- `backend/src/routes/dashboard.js`
- `backend/src/routes/settings.js`

### 5. Copy File Config & Middleware

- `backend/src/config/database.js`
- `backend/src/middleware/auth.js`
- `backend/src/server.js`

### 6. Buat File Frontend

#### Dockerfile (root folder)
```dockerfile
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
```

#### nginx.conf (root folder)
Copy dari artifact sebelumnya

#### .env (root folder)
```env
VITE_API_URL=http://localhost:3000/api
```

### 7. Copy docker-compose.yml

Copy file docker-compose.yml ke root folder

### 8. Copy init.sql

Copy file `backend/init.sql` dari artifact

### 9. Install Axios di Frontend

```bash
npm install axios socket.io-client
```

### 10. Copy src/lib/api.ts

Buat file `src/lib/api.ts` dari artifact sebelumnya

### 11. Buat Setup Script

```bash
# Buat file setup.sh
nano setup.sh

# Copy isi dari artifact setup.sh
# Kemudian:

chmod +x setup.sh
```

### 12. Jalankan Setup

```bash
./setup.sh
```

Script ini akan:
- ✅ Membuat struktur folder
- ✅ Generate password hash untuk admin
- ✅ Build Docker images
- ✅ Start semua services
- ✅ Initialize database

## 🎯 Akses Aplikasi

Setelah setup selesai:

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

### Default Login:
```
Email: admin@ispbilling.com
Password: admin123
```

**⚠️ PENTING: Ganti password setelah login pertama!**

## 📝 Docker Commands

```bash
# Melihat status services
docker-compose ps

# Melihat logs
docker-compose logs -f

# Melihat logs service tertentu
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Stop services
docker-compose stop

# Start services
docker-compose start

# Restart services
docker-compose restart

# Restart service tertentu
docker-compose restart backend

# Stop dan remove containers
docker-compose down

# Stop, remove containers dan volumes (HAPUS SEMUA DATA)
docker-compose down -v

# Rebuild containers
docker-compose up -d --build

# Masuk ke container
docker exec -it isp_billing_backend sh
docker exec -it isp_billing_db psql -U ispbilling -d isp_billing
```

## 🔍 Troubleshooting

### 1. Port sudah digunakan

Jika port 8080, 3000, atau 5432 sudah digunakan, edit `docker-compose.yml`:

```yaml
ports:
  - "8081:80"  # Frontend port berbeda
  - "3001:3000"  # Backend port berbeda
  - "5433:5432"  # Database port berbeda
```

Jangan lupa update `.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

### 2. Database connection error

```bash
# Restart database
docker-compose restart postgres

# Cek logs
docker-compose logs postgres

# Recreate database
docker-compose down -v
docker-compose up -d
```

### 3. Frontend tidak bisa connect ke backend

Pastikan `.env` sudah benar:
```env
VITE_API_URL=http://localhost:3000/api
```

Rebuild frontend:
```bash
docker-compose up -d --build frontend
```

### 4. Permission denied

```bash
# Berikan permission
sudo chmod +x setup.sh

# Atau jalankan dengan sudo
sudo ./setup.sh
```

### 5. Lihat detail error

```bash
# Lihat logs semua services
docker-compose logs

# Lihat logs real-time
docker-compose logs -f --tail=100
```

## 🗄️ Database Management

### Backup Database

```bash
docker exec isp_billing_db pg_dump -U ispbilling isp_billing > backup.sql
```

### Restore Database

```bash
docker exec -i isp_billing_db psql -U ispbilling isp_billing < backup.sql
```

### Reset Database

```bash
docker-compose down -v
docker-compose up -d
```

## 🔒 Security

### Production Setup:

1. **Ganti JWT Secret** di `backend/.env`:
```env
JWT_SECRET=$(openssl rand -hex 32)
```

2. **Ganti Database Password** di `docker-compose.yml` dan `backend/.env`

3. **Enable HTTPS** dengan reverse proxy (Nginx/Caddy)

4. **Ganti Default Admin Password** setelah login pertama

5. **Setup Firewall** untuk protect ports

## 📊 Monitoring

### Check Service Health

```bash
# Backend health
curl http://localhost:3000/health

# Check all services
docker-compose ps
```

### View Resource Usage

```bash
docker stats
```

## 🆘 Need Help?

Jika masih ada masalah:

1. Check logs: `docker-compose logs -f`
2. Restart services: `docker-compose restart`
3. Recreate everything: `docker-compose down -v && docker-compose up -d --build`

## ✅ Verification

Setelah install, verify:

- [ ] Frontend bisa diakses di http://localhost:8080
- [ ] Bisa login dengan credentials default
- [ ] Dashboard menampilkan data
- [ ] Bisa create customer baru
- [ ] Backend API response di http://localhost:3000/health

## 🎉 Done!

Aplikasi ISP Billing System siap digunakan!

---

**Support**: Jika ada masalah, check logs dengan `docker-compose logs -f`
