caro-game/
├── backend/                          # Backend: Node.js + Express + PostgreSQL
│   ├── config/
│   │   └── config.js                 # Sequelize config (dev, test, prod)
│   ├── migrations/                   # Sequelize CLI migrations
│   │   ├── 20241030-create-user.js
│   │   ├── 20241030-create-game.js
│   │   ├── 20241030-create-friend.js
│   │   ├── 20241030-create-friend-request.js
│   │   ├── 20241030-create-room.js
│   │   ├── 20241030-create-admin-log.js
│   │   └── 20241030-add-avatar-to-user.js
│   ├── seeders/                      # Seed data
│   │   ├── 20241030-seed-admin.js
│   │   ├── 20241030-seed-avatars.js
│   │   └── 20241030-seed-sample-users.js
│   ├── models/
│   │   ├── index.js                  # Export all models + associations
│   │   ├── User.js                   # username, password, score, avatar, role, status
│   │   ├── Game.js                   # player1Id, player2Id, winnerId, moves (JSON)
│   │   ├── Friend.js                 # userId, friendId, status
│   │   ├── FriendRequest.js          # fromId, toId, status
│   │   ├── Room.js                   # roomId, player1Id, player2Id, status
│   │   └── AdminLog.js               # adminId, targetId, action, details
│   ├── controllers/
│   │   ├── authController.js         # register, login
│   │   ├── gameController.js         # leaderboard, history
│   │   ├── friendController.js       # sendRequest, accept, list
│   │   └── adminController.js        # ban, kick, broadcast, logs
│   ├── middlewares/
│   │   ├── authMiddleware.js         # JWT verify
│   │   └── adminMiddleware.js        # role === 'admin'
│   ├── routes/
│   │   ├── auth.js                   # /api/auth
│   │   ├── game.js                   # /api/game
│   │   ├── friend.js                 # /api/friends
│   │   └── admin.js                  # /api/admin
│   ├── services/
│   │   ├── gameService.js            # checkWin, createBoard, minimaxAI
│   │   ├── socketService.js          # Socket.IO + WebRTC signaling
│   │   ├── roomService.js            # create, join, list, delete room
│   │   └── friendService.js          # send, accept, remove friend
│   ├── utils/
│   │   ├── jwt.js                    # sign, verify
│   │   └── helpers.js                # generateRoomId, validate
│   ├── public/
│   │   ├── sounds/                   # Âm thanh hiệu ứng
│   │   │   ├── click.wav
│   │   │   ├── win.mp3
│   │   │   ├── lose.mp3
│   │   │   └── notify.wav
│   │   └── avatars/                  # 10+ avatar có sẵn
│   │       ├── default.png
│   │       ├── avatar1.png
│   │       └── ...
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js                     # Entry point (Express + Socket.IO)
│
├── frontend/                         # Frontend: React + Vite + Tailwind
│   ├── public/
│   │   ├── index.html
│   │   └── sounds/                   # Copy từ backend/public/sounds
│   ├── src/
│   │   ├── assets/
│   │   │   └── avatars/              # Copy từ backend/public/avatars
│   │   ├── components/
│   │   │   ├── Board.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── VoiceChatToggle.jsx
│   │   │   ├── RoomCard.jsx
│   │   │   ├── RoomList.jsx
│   │   │   ├── FriendList.jsx
│   │   │   ├── FriendRequestModal.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── OnlineUsers.jsx
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