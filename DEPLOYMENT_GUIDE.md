# 🚀 GitHub Actions & Deployment Guide

## 📋 Mục Lục

1. [GitHub Actions Setup](#github-actions-setup)
2. [Environment Variables](#environment-variables)
3. [VPS Deployment](#vps-deployment)
4. [SSL Certificate](#ssl-certificate)
5. [Troubleshooting](#troubleshooting)

---

## 🔄 GitHub Actions Setup

### Bước 1: Setup GitHub Secrets

Trên GitHub repo của bạn, vào **Settings → Secrets and variables → Actions**

Thêm các secrets sau:

```
DOCKER_USERNAME        → Docker Hub username
DOCKER_PASSWORD        → Docker Hub access token (NOT password!)
VPS_HOST              → IP address của VPS (ví dụ: 123.45.67.89)
VPS_USER              → SSH user (thường là 'root' hoặc 'ubuntu')
VPS_SSH_KEY           → Private SSH key (để kết nối VPS)
```

### Bước 2: Tạo SSH Key (Nếu chưa có)

```bash
# Trên máy local
ssh-keygen -t rsa -b 4096 -f ~/.ssh/vps_deploy

# Copy public key lên VPS
ssh-copy-id -i ~/.ssh/vps_deploy.pub user@your-vps-ip

# Copy private key vào GitHub Secret (VPS_SSH_KEY)
cat ~/.ssh/vps_deploy
# Paste toàn bộ content vào Secret
```

### Bước 3: Docker Hub Token

```bash
# Vào https://hub.docker.com/settings/security
# Tạo Access Token
# Copy token vào DOCKER_PASSWORD secret
```

---

## 🌍 Environment Variables

### Backend (.env)

```bash
# Database
MONGODB_URI=mongodb://admin:admin123@mongo:27017/pawcare?authSource=admin

# JWT
JWT_ACCESS_SECRET=your_super_secret_key_minimum_32_characters_long
JWT_REFRESH_SECRET=your_super_refresh_secret_key_minimum_32_characters
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://pawcare.example.com

# (Optional) Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# (Optional) Google Maps
GOOGLE_MAPS_API_KEY=your_api_key

# (Optional) Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_email@appspot.gserviceaccount.com
```

### Frontend (.env.production)

```bash
VITE_API_URL=https://api.pawcare.example.com
VITE_GOOGLE_MAPS_API_KEY=your_api_key
```

---

## 🖥️ VPS Deployment

### Yêu cầu VPS

- Ubuntu 20.04+ hoặc CentOS 7+
- Ít nhất 2GB RAM
- 20GB storage
- Docker + Docker Compose

### Bước 1: Chuẩn Bị VPS

```bash
# SSH vào VPS
ssh user@your-vps-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Cài Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Cài Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user vào docker group
sudo usermod -aG docker $USER
newgrp docker

# Kiểm tra
docker --version
docker-compose --version
```

### Bước 2: Clone Repo & Setup

```bash
# Tạo thư mục project
mkdir -p /opt/pawcare
cd /opt/pawcare

# Clone repo
git clone --branch main https://github.com/your-username/pawcare.git .

# Tạo .env file từ .env.example
cp .env.example .env
# Edit .env với real values
nano .env
```

### Bước 3: Deploy

```bash
# Build images (optional - GitHub Actions sẽ push images)
docker-compose -f docker-compose.prod.yml up -d

# Kiểm tra logs
docker-compose logs -f

# Health check
curl http://localhost:5000/api/health
```

---

## 🔒 SSL Certificate

### Option 1: Let's Encrypt (Free)

```bash
# Cài Certbot
sudo apt install certbot python3-certbot-nginx -y

# Tạo certificate
sudo certbot certonly --standalone \
  -d pawcare.example.com \
  -d api.pawcare.example.com \
  --agree-tos \
  -m admin@pawcare.example.com

# Renew automatically (đã được setup mặc định)
```

### Option 2: Self-signed (Testing)

```bash
# Tạo self-signed certificate
mkdir -p /opt/pawcare/ssl
cd /opt/pawcare/ssl

openssl req -x509 -newkey rsa:4096 \
  -keyout key.pem \
  -out cert.pem \
  -days 365 \
  -nodes \
  -subj "/CN=pawcare.example.com"
```

### Cập Nhật nginx.conf

```nginx
# Thêm SSL configuration
server {
    listen 443 ssl http2;
    server_name pawcare.example.com api.pawcare.example.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # ... rest của config
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name _;
    return 301 https://$host$request_uri;
}
```

---

## 🔄 CI/CD Workflow

### ci.yml (Automatic)

Trigger: `push` hoặc `pull_request` vào `dev/main`

**Steps:**

1. 🔧 Install dependencies (frontend + backend)
2. 🧪 Run tests
3. 🏗️ Build Docker images
4. 📤 Push to Docker Hub

### cd.yml (Automatic)

Trigger: `push` vào `main`

**Steps:**

1. 📥 Pull latest images từ Docker Hub
2. 🔌 SSH vào VPS
3. 📥 docker-compose pull
4. 🚀 docker-compose up -d
5. ✅ Health check
6. 🔄 Rollback nếu thất bại

---

## 🐛 Troubleshooting

### Docker build thất bại

```bash
# Xem logs
docker-compose logs backend
docker-compose logs frontend

# Xoá cache & rebuild
docker-compose down
docker system prune -a
docker-compose -f docker-compose.prod.yml up -d --build
```

### Certificate error

```bash
# Renew certificate
sudo certbot renew -v

# Kiểm tra expiry
sudo certbot certificates
```

### MongoDB connection error

```bash
# Check MongoDB status
docker-compose logs mongo

# Restart MongoDB
docker-compose restart mongo
```

### Health check failing

```bash
# Test backend API
curl -v http://localhost:5000/api/health

# Test frontend
curl -v http://localhost/

# Xem logs
docker-compose logs backend frontend
```

### GitHub Actions deployment failed

1. ✅ Kiểm tra GitHub Secrets có chính xác không
2. ✅ SSH key có hợp lệ không
3. ✅ VPS có online không
4. ✅ Xem logs: GitHub Actions → Jobs → Logs

---

## 📊 Monitoring

### View logs

```bash
# Real-time logs
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Check container status

```bash
docker-compose ps
docker stats
```

### Database backup

```bash
# Backup MongoDB
docker-compose exec mongo mongodump --out /backup

# Export to file
docker-compose exec mongo mongodump --out - | gzip > backup.tar.gz
```

---

**Bạn sẽ cần:**

- GitHub account + repo
- Docker Hub account
- VPS với SSH access
- Domain name

Còn câu hỏi gì không? 🚀
