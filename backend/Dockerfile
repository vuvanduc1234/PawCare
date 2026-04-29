# Dockerfile cho Backend
FROM node:18-alpine

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép package.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ source code
COPY . .

# Expose port
EXPOSE 5000

# Chạy ứng dụng
CMD ["npm", "start"]
