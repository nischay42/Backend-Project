# 📺 Play - Full Stack Video Streaming Platform

A full-stack video streaming application built with modern web technologies. Features user authentication, video uploads with cloud storage, playlists, subscriptions, likes, comments, tweets, and comprehensive video analytics.

## 🎯 Features

### Core Features
- **User Management** - Registration, login, profile management, password updates
- **Video Upload & Management** - Upload videos with thumbnail generation, delete, update metadata
- **Video Streaming** - Adaptive quality streaming with FFmpeg processing
- **Playlists** - Create, manage, and organize playlists; save playlists from other users
- **Subscriptions** - Subscribe/unsubscribe to channels, manage subscribers
- **Social Features** - Like/unlike videos, add comments, tweet updates
- **Watch Later** - Add videos to watch later queue
- **Dashboard Analytics** - View channel statistics, video views, watch history

## 🏗️ Tech Stack

### Frontend
- **React 19** - UI framework with Vite for fast development
- **TypeScript** - Type-safe development
- **Redux Toolkit & Redux Persist** - State management with persistence
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v7** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Plyr/Video.js** - Video player components
- **Lucide Icons** - Icon library

### Backend
- **Node.js & Express 5** - REST API server
- **MongoDB & Mongoose** - NoSQL database with ODM
- **JWT** - Authentication & authorization
- **Cloudinary** - Cloud storage for videos and images
- **FFmpeg** - Video processing
- **Multer** - File upload middleware
- **Bcrypt** - Password hashing
- **Cors & Cookie Parser** - Security middleware

### Database
- **MongoDB** - Primary database (play)
- **Collections**: users, videos, playlists, comments, likes, subscriptions, tweets, videoViews

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas connection)
- **Cloudinary Account** (for media storage)
- **FFmpeg** (for video processing)

## 🚀 Quick Start

### Clone the Repository
```bash
git clone https://github.com/nischay42/Play.git
cd play
```

### Backend Setup

#### 1. Navigate to Backend Directory
```bash
cd Backend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Create Environment Variables
Create a `.env` file in the Backend directory:
```env
PORT=8000
CORS_ORIGIN=http://localhost:5173
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/play
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### 4. Start Backend Development Server
```bash
npm run dev
```
Backend will run on `http://localhost:8000`

### Frontend Setup

#### 1. Navigate to Frontend Directory
```bash
cd Frontend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Create Environment Variables
Create a `.env` file in the Frontend directory:
```env
VITE_API_URL=http://localhost:8000
```

#### 4. Start Frontend Development Server
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
03-chai aur backend/
├── Backend/
│   ├── src/
│   │   ├── controllers/     # Business logic for each route
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoint definitions
│   │   ├── middlewares/     # Authentication, error handling, file upload
│   │   ├── utils/           # Helper functions (API responses, error handling)
│   │   ├── db/              # Database connection
│   │   ├── app.js           # Express app setup
│   │   └── index.js         # Server entry point
│   ├── public/temp/         # Temporary file storage
│   ├── package.json
│   └── README.md
│
├── Frontend/
│   ├── src/
│   │   ├── api/             # API client functions
│   │   ├── app/             # Redux store setup
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── features/        # Redux slices
│   │   ├── context/         # React context (e.g., ToastContext)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # React DOM entry
│   ├── package.json
│   └── README.md
│
└── README.md (this file)
```

## 🔌 API Endpoints Overview

The backend provides RESTful API endpoints organized by resource:

| Resource | Endpoints |
|----------|-----------|
| **Users** | Auth, profile, subscriptions |
| **Videos** | Upload, fetch, delete, views, search |
| **Playlists** | Create, manage, add/remove videos |
| **Comments** | Add, delete, manage comment threads |
| **Likes** | Like/unlike videos |
| **Subscriptions** | Subscribe, get subscriber lists |
| **Tweets** | Post, delete user tweets |
| **Dashboard** | Channel analytics & statistics |

See [Backend README](./Backend/README.md) for detailed endpoint documentation.

## 🛠️ Available Scripts

### Backend
```bash
npm run dev        # Start development server with Nodemon
```

### Frontend
```bash
npm run dev        # Start Vite development server
npm run build      # Build for production (TypeScript check + Vite build)
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🗄️ Database Schema Overview

### Core Collections
- **Users** - User accounts, authentication, profile info
- **Videos** - Video metadata, files, views, duration
- **Playlists** - Playlist info, video references, owners
- **Comments** - Video comments with threads
- **Likes** - Likes on videos and playlists
- **Subscriptions** - Channel subscriptions
- **Tweets** - User tweets/updates
- **VideoViews** - Video view tracking

## 🔐 Authentication Flow

1. User registers/logs in with email and password
2. Backend validates credentials and returns JWT token
3. Frontend stores token in Redux + localStorage (redux-persist)
4. API requests include token in Authorization header
5. Backend middleware validates JWT on protected routes
6. Automatic token refresh on 401 response

## 📸 Features Highlights

### Video Management
- Upload videos (processed with FFmpeg)
- View tracking
- Duration calculation

### Social Features
- Subscribe to channels
- Like/unlike videos
- Comment on videos
- Create tweets
- Add to playlists
- Save playlists

### User Dashboard
- Channel statistics
- Upload history
- Analytics graphs
- Subscriber management

## 🚨 Error Handling

The API uses standardized error responses:
```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error description",
  "success": false
}
```

Common status codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 📦 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy the dist/ folder to Vercel
```

### Backend (Your preferred hosting)
- Set environment variables
- Deploy to Heroku, Railway, or your server
- Ensure MongoDB is accessible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Nischay** - Full Stack Developer

## 📚 Learning Resources

This project was built following the "Chai aur Backend" YouTube series with JavaScript/Node.js backend development practices and patterns.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

### MongoDB Connection Error
- Verify MongoDB Atlas connection string
- Check firewall/network access
- Ensure IP whitelist is configured

### Cloudinary Upload Fails
- Verify Cloudinary credentials
- Check file size limits
- Ensure account has upload permissions

### FFmpeg Not Found
- Install FFmpeg globally
- Update FFMPEG_PATH in .env

## 📞 Support

For issues and questions, please open an issue on GitHub or check the Backend/Frontend README files for specific documentation.

---

**Happy Coding! 🚀**
