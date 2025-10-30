# ⚡ Quick Start Guide - Caro Game

## 🚀 Chạy Dự Án Nhanh (Development Mode)

### Bước 1: Clone & Setup

```bash
git clone https://github.com/phatdat20905/game-caro.git
cd game-caro
```

### Bước 2: Setup Database (PostgreSQL)

**Option 1: Docker (Khuyến nghị)**
```bash
# Chạy PostgreSQL trong Docker
docker-compose up -d postgres

# Đợi 10 giây cho PostgreSQL khởi động
```

**Option 2: PostgreSQL Local**
```bash
# Tạo database
psql -U postgres
CREATE DATABASE caro_db;
\q
```

### Bước 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Tạo file .env
cp .env.example .env

# Chỉnh sửa .env nếu cần (mặc định là ok)
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=postgres123
# DB_NAME=caro_db
# JWT_SECRET=your_super_secret_jwt_key

# Chạy migrations
npm run migrate

# Seed data mẫu
npm run seed

# Start backend server
npm run dev
```

✅ Backend chạy tại: `http://localhost:5000`

### Bước 4: Setup Frontend

```bash
# Mở terminal mới
cd frontend

# Install dependencies
npm install

# Tạo file .env
cp .env.example .env

# Nội dung .env (mặc định):
# VITE_API_URL=http://localhost:5000/api
# VITE_SOCKET_URL=http://localhost:5000

# Start frontend dev server
npm run dev
```

✅ Frontend chạy tại: `http://localhost:5173`

---

## 🎮 Test Features

### 1. Test Authentication

#### Tài khoản Admin:
- **Username**: `admin`
- **Password**: `admin123`

#### Tài khoản User mẫu:
- **User 1**: `user1` / `password123`
- **User 2**: `user2` / `password123`
- **User 3**: `user3` / `password123`

### 2. Test Multiplayer

1. Mở 2 browser windows (hoặc 2 browser khác nhau)
2. Window 1: Login bằng `user1`
3. Window 2: Login bằng `user2`
4. Window 1: Click "Create New Room"
5. Window 2: Click "Join Game" trên room vừa tạo
6. Chơi game!

### 3. Test AI Mode

1. Login
2. Scroll xuống section "AI Mode"
3. Click "Enable Voice Chat" (optional)
4. Click "Play vs AI"
5. Đánh cờ với AI

### 4. Test Chat

1. Trong game room, gõ tin nhắn ở chat box
2. Tin nhắn sẽ hiện real-time cho cả 2 người chơi
3. Click icon minimize để thu gọn/mở rộng chat

### 5. Test Voice Chat

1. Trong game room
2. Click "Enable Voice Chat"
3. Cho phép truy cập microphone
4. Click "Mute/Unmute" để bật/tắt mic

### 6. Test Leaderboard

1. Click "Leaderboard" trong menu
2. Xem top 10 players
3. Chơi vài game để thấy điểm cập nhật realtime

### 7. Test Friends

1. Click "Friends" trong menu
2. Tab "Add Friend": Tìm kiếm user và gửi lời mời
3. Tab "Requests": Chấp nhận lời mời kết bạn
4. Tab "Friends": Xem danh sách bạn bè

### 8. Test Replay

1. Sau khi chơi xong một game
2. Vào profile hoặc history
3. Click "Replay" để xem lại game
4. Video tự động chạy từng nước

### 9. Test Admin Panel

1. Login bằng tài khoản `admin`
2. Click "Admin Panel"
3. Xem danh sách online users
4. Thử ban một user
5. Broadcast message
6. Kick user từ room

---

## 🐛 Troubleshooting

### Backend không chạy được

**Lỗi: "Database connection failed"**
```bash
# Kiểm tra PostgreSQL đang chạy
docker ps  # (nếu dùng Docker)
# hoặc
pg_isready -U postgres

# Reset database
cd backend
npm run migrate:undo
npm run migrate
npm run seed
```

**Lỗi: "Port 5000 already in use"**
```bash
# Đổi PORT trong .env
PORT=5001

# Hoặc kill process đang dùng port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :5000
kill -9 <PID>
```

### Frontend không connect được Socket.IO

```bash
# Kiểm tra file .env
cat frontend/.env

# Phải có:
VITE_SOCKET_URL=http://localhost:5000

# Restart frontend
npm run dev
```

### Migrations lỗi

```bash
cd backend

# Undo all migrations
npm run migrate:undo:all

# Chạy lại
npm run migrate

# Seed lại
npm run seed
```

---

## 📦 Build Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Output sẽ ở folder dist/
```

---

## 🔧 Database Commands

```bash
cd backend

# Migrations
npm run migrate          # Run all pending migrations
npm run migrate:undo     # Undo last migration
npm run migrate:undo:all # Undo all migrations

# Seeders
npm run seed             # Run all seeders
npm run seed:undo        # Undo last seeder
npm run seed:undo:all    # Undo all seeders

# Reset (Undo all → Migrate → Seed)
npm run reset
```

---

## ✅ Feature Checklist

### Must Test:
- [ ] Register new user
- [ ] Login
- [ ] Create room
- [ ] Join room
- [ ] Make moves on board
- [ ] Win/lose detection
- [ ] Chat messages
- [ ] Voice chat (if mic available)
- [ ] Play vs AI
- [ ] Leaderboard
- [ ] Friends system
- [ ] Replay game
- [ ] Admin panel (with admin account)

---

## 🚢 Deploy Options

### Vercel (Frontend)
```bash
cd frontend
vercel --prod
```

### Render (Backend + PostgreSQL)
1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add PostgreSQL database
6. Set environment variables

### Railway (Full Stack)
1. Create new project
2. Add PostgreSQL
3. Add Backend service
4. Add Frontend service
5. Set environment variables
6. Deploy!

---

## 📞 Support

Nếu gặp vấn đề:
1. Check console logs (F12)
2. Check backend terminal
3. Check database connection
4. Review .env files
5. Contact: phatdat20905@gmail.com

---

**Happy Coding! 🎮**
