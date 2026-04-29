#!/bin/bash

# 📦 PawCare Database Backup & Restore Script

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Config
BACKUP_DIR="./backups"
MONGO_CONTAINER="pawcare_mongo"
DB_NAME="pawcare"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/pawcare_backup_$TIMESTAMP.tar.gz"

# Tạo thư mục backup nếu chưa tồn tại
mkdir -p "$BACKUP_DIR"

# Function: Backup Database
backup_database() {
    echo -e "${YELLOW}🔄 Đang sao lưu database...${NC}"
    
    if ! docker ps | grep -q "$MONGO_CONTAINER"; then
        echo -e "${RED}❌ Container MongoDB không chạy${NC}"
        exit 1
    fi
    
    # Tạo dump
    docker exec "$MONGO_CONTAINER" mongodump \
        --authenticationDatabase admin \
        -u admin \
        -p admin123 \
        --out /tmp/backup
    
    # Compress
    docker exec "$MONGO_CONTAINER" tar -czf /tmp/backup.tar.gz -C /tmp backup
    
    # Copy ra host
    docker cp "$MONGO_CONTAINER:/tmp/backup.tar.gz" "$BACKUP_FILE"
    
    # Clean up
    docker exec "$MONGO_CONTAINER" rm -rf /tmp/backup /tmp/backup.tar.gz
    
    echo -e "${GREEN}✅ Backup thành công: $BACKUP_FILE${NC}"
    ls -lh "$BACKUP_FILE"
}

# Function: Restore Database
restore_database() {
    local RESTORE_FILE=$1
    
    if [ ! -f "$RESTORE_FILE" ]; then
        echo -e "${RED}❌ File backup không tồn tại: $RESTORE_FILE${NC}"
        exit 1
    fi
    
    if ! docker ps | grep -q "$MONGO_CONTAINER"; then
        echo -e "${RED}❌ Container MongoDB không chạy${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}🔄 Đang restore database từ: $RESTORE_FILE${NC}"
    
    # Copy file vào container
    docker cp "$RESTORE_FILE" "$MONGO_CONTAINER:/tmp/backup.tar.gz"
    
    # Extract
    docker exec "$MONGO_CONTAINER" tar -xzf /tmp/backup.tar.gz -C /tmp
    
    # Restore data
    docker exec "$MONGO_CONTAINER" mongorestore \
        --authenticationDatabase admin \
        -u admin \
        -p admin123 \
        --drop \
        /tmp/backup
    
    # Clean up
    docker exec "$MONGO_CONTAINER" rm -rf /tmp/backup /tmp/backup.tar.gz
    
    echo -e "${GREEN}✅ Restore thành công${NC}"
}

# Function: List backups
list_backups() {
    echo -e "${YELLOW}📋 Danh sách backups:${NC}"
    ls -lh "$BACKUP_DIR" | tail -n +2
}

# Function: Delete old backups (keep last 7 days)
cleanup_old_backups() {
    echo -e "${YELLOW}🧹 Xoá backup cũ (giữ lại 7 ngày)...${NC}"
    find "$BACKUP_DIR" -type f -name "*.tar.gz" -mtime +7 -delete
    echo -e "${GREEN}✅ Cleanup hoàn thành${NC}"
}

# Function: Export to CSV (for analysis)
export_users_csv() {
    echo -e "${YELLOW}📤 Export users to CSV...${NC}"
    
    docker exec "$MONGO_CONTAINER" mongosh \
        -u admin \
        -p admin123 \
        --authenticationDatabase admin \
        "$DB_NAME" << 'EOF' > users_export.csv
db.users.find().forEach(doc => {
    print(doc._id + "," + doc.email + "," + doc.fullName + "," + doc.role + "," + doc.createdAt);
});
EOF
    
    echo -e "${GREEN}✅ Export hoàn thành: users_export.csv${NC}"
}

# Main menu
show_menu() {
    echo -e "\n${YELLOW}🐾 PawCare Database Manager${NC}"
    echo "1. 💾 Backup Database"
    echo "2. 📥 Restore Database"
    echo "3. 📋 List Backups"
    echo "4. 🧹 Cleanup Old Backups"
    echo "5. 📤 Export Users CSV"
    echo "6. ❌ Exit"
    echo ""
}

# Main script
if [ "$1" == "backup" ]; then
    backup_database
elif [ "$1" == "restore" ]; then
    restore_database "$2"
elif [ "$1" == "list" ]; then
    list_backups
elif [ "$1" == "cleanup" ]; then
    cleanup_old_backups
elif [ "$1" == "export" ]; then
    export_users_csv
else
    # Interactive mode
    while true; do
        show_menu
        read -p "Chọn (1-6): " choice
        
        case $choice in
            1) backup_database ;;
            2) read -p "Nhập đường dẫn file backup: " restore_file
               restore_database "$restore_file" ;;
            3) list_backups ;;
            4) cleanup_old_backups ;;
            5) export_users_csv ;;
            6) echo -e "${GREEN}Tạm biệt! 👋${NC}"; exit 0 ;;
            *) echo -e "${RED}❌ Lựa chọn không hợp lệ${NC}" ;;
        esac
    done
fi
