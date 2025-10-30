# 🚀 Hướng Dẫn Push Dự Án Lên GitHub

## Bước 1: Khởi tạo Git Repository (nếu chưa có)

```bash
# Mở terminal trong thư mục gốc dự án
cd d:/Workspace/LapTrinhMang/game-caro

# Khởi tạo git (nếu chưa có)
git init

# Kiểm tra trạng thái
git status
```

## Bước 2: Tạo file .gitignore (nếu chưa có)

Tạo file `.gitignore` trong thư mục gốc với nội dung:

```gitignore
# Dependencies
node_modules/
**/node_modules/

# Environment variables
.env
**/.env
.env.local
.env.production

# Build outputs
dist/
build/
**/dist/
**/build/

# Logs
*.log
logs/
npm-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Database
*.sqlite
*.db

# Temporary files
tmp/
temp/
*.tmp
```

## Bước 3: Add và Commit Files

```bash
# Add tất cả files
git add .

# Hoặc add từng phần
git add backend/
git add frontend/
git add README.md
git add docker-compose.yml

# Commit lần đầu
git commit -m "🎉 Initial commit: Fullstack Caro Game with React + Node.js + PostgreSQL"

# Hoặc commit chi tiết hơn
git commit -m "✨ feat: Complete Caro Game implementation

- Backend: Node.js + Express + Socket.IO + PostgreSQL
- Frontend: React + Vite + TailwindCSS + Zustand
- Features: Multiplayer rooms, AI mode, chat, voice chat
- UI/UX: Beautiful gradient design with animations
- Auth: JWT authentication with role-based access
- Real-time: Socket.IO for game moves and chat
- Database: Sequelize ORM with migrations and seeders"
```

## Bước 4: Tạo Repository Trên GitHub

1. Truy cập https://github.com/new
2. Điền thông tin:
   - **Repository name**: `game-caro`
   - **Description**: `🎮 Fullstack multiplayer Caro game with beautiful UI, real-time features, and AI opponent`
   - **Public** hoặc **Private** (tùy bạn)
   - **KHÔNG** chọn "Initialize with README" (vì đã có README.md)
3. Click **Create repository**

## Bước 5: Kết Nối với GitHub Repository

```bash
# Thêm remote origin (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/phatdat20905/game-caro.git

# Hoặc dùng SSH (nếu đã setup SSH key)
git remote add origin git@github.com:phatdat20905/game-caro.git

# Kiểm tra remote
git remote -v
```

## Bước 6: Push Code Lên GitHub

```bash
# Push lần đầu
git push -u origin master

# Hoặc nếu branch chính là main
git branch -M main
git push -u origin main
```

Nếu gặp lỗi authentication:
- **HTTPS**: Dùng Personal Access Token thay vì password
- **SSH**: Cần setup SSH key trước

## Bước 7: Tạo Personal Access Token (nếu dùng HTTPS)

1. Vào https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Chọn quyền: `repo` (full control)
4. Generate và copy token
5. Khi push, dùng token làm password

## Bước 8: Các Commit Tiếp Theo

### Commit Strategy (Conventional Commits)

```bash
# Feature mới
git add .
git commit -m "✨ feat: Add spectator mode to watch live games"
git push

# Fix bug
git commit -m "🐛 fix: Resolve voice chat connection issue"
git push

# UI improvement
git commit -m "💄 style: Improve board animations and colors"
git push

# Documentation
git commit -m "📝 docs: Update README with installation steps"
git push

# Performance
git commit -m "⚡ perf: Optimize AI minimax algorithm"
git push

# Refactor
git commit -m "♻️ refactor: Reorganize socket event handlers"
git push
```

### Emoji Commit Types

- `🎉` `:tada:` - Initial commit
- `✨` `:sparkles:` - New feature
- `🐛` `:bug:` - Bug fix
- `📝` `:memo:` - Documentation
- `💄` `:lipstick:` - UI/style
- `♻️` `:recycle:` - Refactor
- `⚡` `:zap:` - Performance
- `🔒` `:lock:` - Security
- `🚀` `:rocket:` - Deploy
- `✅` `:white_check_mark:` - Tests
- `🔧` `:wrench:` - Config
- `🌐` `:globe_with_meridians:` - Internationalization

## Bước 9: Tạo 20+ Meaningful Commits (Yêu Cầu Đề Bài)

```bash
# Commit 1
git add backend/src/socket/game.socket.js
git commit -m "✨ feat: Implement game move logic with win detection"
git push

# Commit 2
git add backend/src/socket/room.socket.js
git commit -m "✨ feat: Add room management (create/join/leave)"
git push

# Commit 3
git add backend/src/services/game.service.js
git commit -m "✨ feat: Add saveGame and leaderboard functions"
git push

# Commit 4
git add backend/src/utils/minimax.js
git commit -m "🧠 feat: Implement Minimax AI with Alpha-Beta pruning"
git push

# Commit 5
git add backend/src/socket/user.socket.js
git commit -m "✨ feat: Track online users with real-time status"
git push

# Commit 6
git add frontend/src/components/game/Board.jsx frontend/src/components/game/Cell.jsx
git commit -m "💄 style: Beautiful board UI with last move highlight"
git push

# Commit 7
git add frontend/src/components/common/Toast.jsx frontend/src/components/common/ToastContainer.jsx
git commit -m "✨ feat: Add toast notification system"
git push

# Commit 8
git add frontend/src/components/game/ChatBox.jsx
git commit -m "💬 feat: Real-time chat with unread badges and sounds"
git push

# Commit 9
git add frontend/src/components/game/VoiceChat.jsx
git commit -m "🎙️ feat: WebRTC voice chat with mute/unmute controls"
git push

# Commit 10
git add frontend/src/pages/GameRoom.jsx
git commit -m "✨ feat: Complete game room with board, chat, and voice"
git push

# Commit 11
git add frontend/src/index.css
git commit -m "💄 style: Add custom animations and glass morphism effects"
git push

# Commit 12
git add frontend/src/services/sound.js
git commit -m "🔊 feat: Add sound effects for click, win, lose, notify"
git push

# ... tiếp tục cho đến 20+ commits

# Commit 20
git add README.md
git commit -m "📝 docs: Complete README with full documentation"
git push

# Commit 21
git add .env.example
git commit -m "🔧 config: Add environment variable examples"
git push
```

## Bước 10: Tạo GitHub Pages (Optional - cho Demo)

```bash
# Build frontend
cd frontend
npm run build

# Deploy lên GitHub Pages hoặc Vercel
```

## Bước 11: Add Topics và Description

Trên GitHub repository page:
1. Click **⚙️ Settings** (hoặc edit description)
2. Add topics: `react`, `nodejs`, `postgresql`, `socket-io`, `game`, `multiplayer`, `caro`, `gomoku`, `tailwindcss`, `webrtc`
3. Add website URL (nếu có deployed)

## 📋 Checklist Trước Khi Push

- [ ] Code chạy được không có lỗi
- [ ] Đã test các chức năng chính
- [ ] Đã xóa console.log không cần thiết
- [ ] File .env KHÔNG được commit
- [ ] .gitignore đã đúng
- [ ] README.md đã hoàn chỉnh
- [ ] .env.example đã có
- [ ] Package.json đã update đúng dependencies

## 🎯 Mục Tiêu

✅ **20+ meaningful commits** - Chia nhỏ features thành các commits riêng biệt
✅ **Clean code** - Code dễ đọc, có comments
✅ **Complete features** - Đầy đủ 50+ features theo yêu cầu
✅ **Beautiful UI** - Giao diện đẹp với animations
✅ **Production-ready** - Sẵn sàng deploy

## 🚀 Deploy Options

### Vercel (Frontend)
```bash
cd frontend
vercel
```

### Render (Backend)
1. Connect GitHub repo
2. Set environment variables
3. Deploy

### Railway (Full Stack)
1. Connect GitHub repo
2. Setup PostgreSQL
3. Deploy both services

---

**Chúc bạn thành công! 🎉**
