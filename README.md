# 🎮 Caro Game Pro - Fullstack Multiplayer Game

<div align="center">

![Caro Game](https://img.shields.io/badge/Game-Caro%2015x15-blueviolet?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socket.io)

**A production-ready, real-time multiplayer Caro (Gomoku) game with beautiful UI and advanced features**

[Features](#-core-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Screenshots](#-screenshots) • [Demo](#-demo)

</div>

---

## 📋 **Core Features**

### 🔐 **Authentication & Profile**
- ✅ Secure user registration and login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (User / Admin)
- ✅ User profiles with stats (wins, losses, score)
- ✅ 10+ beautiful predefined avatars
- ✅ Real-time online status tracking (Online / Offline / In-Game)

### 🎲 **Game Modes**
- ✅ **1v1 Online Multiplayer** - Play with friends or random opponents
- ✅ **1v1 vs AI** - Challenge AI powered by Minimax + Alpha-Beta Pruning
- ✅ **Spectator Mode** - Watch live games in real-time
- ✅ **Quick Play** - Auto-match with random online players

### 🏠 **Multiplayer Rooms**
- ✅ Create private rooms with auto-generated room IDs
- ✅ Join rooms via room ID or room list
- ✅ Real-time room list updates
- ✅ Invite friends directly to play
- ✅ Watch ongoing games as spectator

### 🎯 **Game Core (15×15 Caro Board)**
- ✅ Responsive 15×15 grid board
- ✅ Turn-based X/O gameplay
- ✅ Win detection (5 consecutive symbols in any direction)
- ✅ Draw detection when board is full
- ✅ **Visual highlight of last move** with animation
- ✅ **Winning cells animation**
- ✅ Move counter and game state indicators

### 💬 **In-Game Interaction**
- ✅ **Real-time text chat** per room with message history
- ✅ **Voice chat** using WebRTC (SimplePeer)
- ✅ Mute/Unmute voice controls
- ✅ Chat notification sounds
- ✅ Unread message badges

### 🎵 **Sound Effects (Howler.js)**
- ✅ Click sound on cell placement
- ✅ Win/Lose sound effects
- ✅ Chat notification sound
- ✅ Voice toggle sound

### 👥 **Friends System**
- ✅ Send/Accept/Decline friend requests
- ✅ Real-time friend list with online status
- ✅ Search users to add as friends
- ✅ Invite friends to play
- ✅ Remove friends

### 📜 **Match History & Replay**
- ✅ Store full move sequence in database (JSON)
- ✅ View past games in profile
- ✅ **Replay mode** - Watch games step-by-step with play/pause controls
- ✅ Game result tracking (winner, loser, moves)

### 🏆 **Leaderboard**
- ✅ Top 10 players ranked by score
- ✅ **Real-time leaderboard updates** when games finish
- ✅ Beautiful gradient UI with player avatars

### 👨‍💼 **Admin Panel**
- ✅ View all online users
- ✅ View all active game rooms
- ✅ Ban/Unban users (temporary or permanent)
- ✅ Kick players from rooms
- ✅ Send private warnings
- ✅ Broadcast system messages to all users
- ✅ Admin action logging

### 🌐 **Real-time Features (Socket.IO)**
- ✅ Real-time game moves synchronization
- ✅ Online user tracking
- ✅ Room state management
- ✅ Chat and voice signaling
- ✅ Friend request notifications
- ✅ System notifications

### 🎨 **Beautiful UI/UX**
- ✅ Modern glassmorphism design
- ✅ Smooth animations and transitions
- ✅ Gradient backgrounds and hover effects
- ✅ Toast notifications for all actions
- ✅ Responsive design for all screen sizes
- ✅ Loading states and error handling

---

## 🧩 **Tech Stack**

### **Frontend**
- ⚛️ **React 19** - UI Library
- ⚡ **Vite** - Build tool & dev server
- 🎨 **TailwindCSS** - Utility-first CSS framework
- 🐻 **Zustand** - Lightweight state management
- 🔌 **Socket.IO Client** - Real-time communication
- 🎥 **SimplePeer** - WebRTC wrapper for voice chat
- 🔊 **Howler.js** - Audio library for sound effects
- 📡 **Axios** - HTTP client
- 🛣️ **React Router** - Client-side routing

### **Backend**
- 🟢 **Node.js 20** - Runtime environment
- 🚂 **Express 5** - Web framework
- 🔌 **Socket.IO** - WebSocket server
- 🐘 **PostgreSQL** - Relational database
- 🦕 **Sequelize** - ORM for database
- 🔐 **JWT** - Authentication tokens
- 🔒 **bcrypt** - Password hashing
- 🧠 **Minimax Algorithm** - AI opponent with Alpha-Beta Pruning

---

## 🚀 **Installation**

### **Prerequisites**
- Node.js >= 20.x
- PostgreSQL >= 15.x
- npm or yarn
- Git

### **1. Clone Repository**
```bash
git clone https://github.com/phatdat20905/game-caro.git
cd game-caro
```

### **2. Setup Backend**
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET

# Run migrations
npm run migrate

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### **3. Setup Frontend**
```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed (default should work)
# VITE_API_URL=http://localhost:5000/api
# VITE_SOCKET_URL=http://localhost:5000

# Start frontend dev server
npm run dev
```

Frontend will run on `http://localhost:5173`

### **4. Setup with Docker (Optional)**
```bash
# From project root
docker-compose up --build
```

---

## 🎮 **Usage**

### **Default Admin Account**
```
Username: admin
Password: admin123
```

### **Sample User Accounts**
```
Username: user1
Password: password123

Username: user2  
Password: password123
```

### **How to Play**

1. **Register/Login** - Create an account or use sample accounts
2. **Lobby** - View available rooms or create your own
3. **Create Room** - Click "Create Room" to start a new game
4. **Join Room** - Click on any available room or enter room ID
5. **Play** - Take turns placing X/O on the 15×15 board
6. **Win** - Get 5 consecutive symbols (horizontal, vertical, or diagonal)
7. **Chat & Voice** - Communicate with your opponent during the game

### **Play vs AI**
1. Go to Lobby
2. Scroll to "AI Mode" section
3. Click "Play vs AI"
4. Make your move and watch AI respond!

---

## 📸 **Screenshots**

> **Note**: Add screenshots here after UI is complete

### Login & Register
[Screenshot 1] [Screenshot 2]

### Lobby & Room List
[Screenshot 3] [Screenshot 4]

### Game Room
[Screenshot 5] [Screenshot 6]

### Chat & Voice
[Screenshot 7] [Screenshot 8]

### Leaderboard
[Screenshot 9]

### Admin Panel
[Screenshot 10] [Screenshot 11]

### Replay Mode
[Screenshot 12]

---

## 🗂️ **Project Structure**

```
game-caro/
├── backend/
│   ├── src/
│   │   ├── config/          # Database config
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── migrations/      # Database migrations
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── seeders/         # Database seeders
│   │   ├── services/        # Business logic
│   │   ├── socket/          # Socket.IO handlers
│   │   ├── utils/           # Helper functions
│   │   └── server.js        # Entry point
│   ├── public/
│   │   ├── avatars/         # User avatars
│   │   └── sounds/          # Sound effects
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/      # Reusable components
│   │   │   ├── game/        # Game-related components
│   │   │   ├── layout/      # Layout components
│   │   │   ├── room/        # Room components
│   │   │   └── user/        # User components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API & Socket services
│   │   ├── store/           # Zustand store
│   │   ├── utils/           # Helper functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
└── README.md
```

---

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### **Users**
- `GET /api/users/me` - Get current user profile
- `GET /api/users/search` - Search users
- `GET /api/users/:id` - Get user profile

### **Games**
- `GET /api/games/leaderboard` - Get top 10 players
- `GET /api/games/history/:userId` - Get user's match history

### **Friends**
- `GET /api/friends` - Get friend list
- `GET /api/friends/requests` - Get friend requests
- `POST /api/friends/send` - Send friend request
- `POST /api/friends/accept/:id` - Accept friend request
- `DELETE /api/friends/:id` - Remove friend

### **Replay**
- `GET /api/replay/:gameId` - Get game replay data

### **Admin** (Admin only)
- `GET /api/admin/online` - Get online users
- `POST /api/admin/ban` - Ban user
- `POST /api/admin/kick` - Kick user from room
- `POST /api/admin/broadcast` - Broadcast message

---

## 🔌 **Socket.IO Events**

### **Client → Server**
- `createRoom` - Create new game room
- `joinRoom` - Join existing room
- `spectateRoom` - Watch game as spectator
- `leaveRoom` - Leave current room
- `makeMove` - Make a game move
- `sendMessage` - Send chat message
- `offer` / `answer` / `ice-candidate` - WebRTC signaling

### **Server → Client**
- `roomCreated` - Room created successfully
- `gameStart` - Game started
- `moveMade` - Move was made
- `gameOver` - Game finished
- `newMessage` - New chat message
- `userStatusChange` - User status changed
- `leaderboardUpdate` - Leaderboard updated
- `roomList` - Available rooms list
- `onlineUsers` - Online users list

---

## 📦 **Database Schema**

### **Users**
- id, username, password, score, avatar, role, isBanned, banUntil, status

### **Games**
- id, player1Id, player2Id, winnerId, moves (JSON), createdAt

### **Friends**
- id, userId, friendId, createdAt

### **FriendRequests**
- id, fromId, toId, status, createdAt

### **Rooms**
- id, roomId, player1Id, player2Id, status, createdAt

### **AdminLogs**
- id, adminId, targetId, action, details, createdAt

### **RefreshTokens**
- id, userId, token, expiresAt, createdAt

---

## 🛠️ **Development**

### **Running Tests**
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### **Building for Production**
```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

### **Database Commands**
```bash
# Run migrations
npm run migrate

# Undo last migration
npm run migrate:undo

# Seed database
npm run seed

# Reset database (undo all → migrate → seed)
npm run reset
```

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 **License**

This project is licensed under the MIT License.

---

## 👨‍💻 **Author**

**Phạm Phát Đạt**
- GitHub: [@phatdat20905](https://github.com/phatdat20905)
- Email: phatdat20905@gmail.com

---

## 🙏 **Acknowledgments**

- React Team for the amazing framework
- Socket.IO for real-time capabilities
- TailwindCSS for beautiful styling
- PostgreSQL for robust database
- Vite for lightning-fast dev experience

---

## 📊 **Project Stats**

- **Lines of Code**: 10,000+
- **Components**: 40+
- **API Endpoints**: 20+
- **Socket Events**: 25+
- **Database Tables**: 7
- **Features**: 50+

---

<div align="center">

**⭐ Star this repo if you like it! ⭐**

Made with ❤️ by Phạm Phát Đạt

</div>
│   │   │   ├── AvatarPicker.jsx
│   │   │   └── Modal.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── GameContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useGame.js
│   │   │   ├── useVoiceChat.js
│   │   │   └── useSound.js
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Chơi nhanh, tạo phòng, xem phòng
│   │   │   ├── GameRoom.jsx          # Bàn cờ + chat + voice
│   │   │   ├── Profile.jsx           # Lịch sử, replay
│   │   │   ├── Friends.jsx           # Danh sách bạn, gửi lời mời
│   │   │   ├── LeaderboardPage.jsx
│   │   │   ├── Replay.jsx
│   │   │   └── AdminDashboard.jsx    # Quản lý user, phòng, ban
│   │   ├── services/
│   │   │   ├── api.js                # Axios instance
│   │   │   └── socket.js             # Socket.IO client
│   │   ├── utils/
│   │   │   ├── sound.js              # Howler.js wrapper
│   │   │   └── constants.js
│   │   ├── App.jsx                   # Router
│   │   ├── main.jsx
│   │   └── index.css                 # Tailwind base
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js                # Proxy đến backend
│
├── docs/
│   └── screenshots/                  # 12 ảnh nộp bài
│       ├── 01_register_avatar.png
│       ├── 02_room_list.png
│       ├── 03_create_room.png
│       ├── 04_game_with_voice.png
│       ├── 05_friend_request.png
│       ├── 06_leaderboard.png
│       ├── 07_replay.png
│       ├── 08_admin_users.png
│       ├── 09_admin_ban.png
│       └── 10_broadcast.png
├── .gitignore
├── README.md
└── git_history.txt
```




```bash
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── sounds/             # (tùy chọn nếu không dùng backend)
│   │   └── icons/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Modal.jsx
│   │   ├── game/
│   │   │   ├── Board.jsx
│   │   │   ├── Cell.jsx
│   │   │   ├── ChatBox.jsx
│   │   │   ├── VoiceChat.jsx
│   │   │   └── ReplayPlayer.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   ├── room/
│   │   │   ├── RoomCard.jsx
│   │   │   ├── RoomList.jsx
│   │   │   └── CreateRoomModal.jsx
│   │   └── user/
│   │       ├── Avatar.jsx
│   │       ├── ProfileCard.jsx
│   │       └── OnlineStatus.jsx
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Home.jsx
│   │   ├── Lobby.jsx
│   │   ├── GameRoom.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── Friends.jsx
│   │   ├── Replay.jsx
│   │   └── AdminPanel.jsx
│   ├── services/
│   │   ├── api.js              # Axios instance
│   │   ├── socket.js           # Socket.IO client
│   │   ├── auth.js             # Auth store + API
│   │   ├── room.js             # Room API + Socket
│   │   ├── game.js             # Game logic + AI
│   │   └── sound.js            # Howler wrapper
│   ├── store/
│   │   └── useStore.js         # Zustand global state
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```