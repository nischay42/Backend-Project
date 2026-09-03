# Backend API Documentation

A Node.js/Express backend service for Play - a full-stack video streaming platform with comprehensive video management, social features, and analytics.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Middleware](#middleware)
- [Utilities](#utilities)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Cloudinary account
- FFmpeg installed

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.sample .env

# Start development server
npm run dev
```

Server runs on `http://localhost:8000`

## 🔧 Environment Variables

Create a `.env` file in the root of Backend directory:

```env
# Server Configuration
PORT=8000

# Database
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/play

# Access token Refresh token
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
# CORS
CORS_ORIGIN=http://localhost:5173

# Cloudinary (Media Storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

```

### Environment Variable Details

| Variable | Purpose | Example |
|----------|---------|----------|
| `PORT` | Server port | 8000 |
| `MONGODB_URL` | MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/play |
| `JWT_SECRET` | Secret key for JWT signing | random_long_string_here |
| `JWT_EXPIRE` | Token expiration time | 7d |
| `CORS_ORIGIN` | Frontend URL for CORS | http://localhost:5173 |
| `CLOUDINARY_*` | Cloudinary API credentials | From Cloudinary dashboard |

## 📁 Project Structure

```
src/
├── controllers/          # Business logic for each feature
│   ├── user.controller.js
│   ├── video.controller.js
│   ├── playlist.controller.js
│   ├── comment.controller.js
│   ├── like.controller.js
│   ├── subscription.controller.js
│   ├── tweet.controller.js
│   ├── dashboard.controller.js
│   └── healthcheck.controller.js
│
├── models/              # MongoDB Mongoose schemas
│   ├── user.model.js
│   ├── video.model.js
│   ├── playlist.model.js
│   ├── comment.model.js
│   ├── like.model.js
│   ├── subscription.model.js
│   ├── tweet.model.js
│   └── videoView.model.js
│
├── routes/              # API endpoint definitions
│   ├── user.routes.js
│   ├── video.routes.js
│   ├── playlist.routes.js
│   ├── comment.routes.js
│   ├── like.routes.js
│   ├── subscription.routes.js
│   ├── tweet.routes.js
│   ├── dashboard.routes.js
│   └── healthcheck.routes.js
│
├── middlewares/         # Custom middleware
│   ├── auth.middleware.js      # JWT verification
│   ├── error.middleware.js     # Global error handler
│   └── multer.middleware.js    # File upload handling
│
├── utils/               # Utility functions
│   ├── apiError.js              # Standardized error class
│   ├── apiResponse.js           # Standardized response class
│   ├── asyncHandler.js          # Async error wrapper
│   └── cloudinary.js            # Cloudinary upload/delete
│
├── db/
│   └── index.js         # MongoDB connection
│
├── constants.js         # App constants (DB_NAME)
├── app.js              # Express app configuration
└── index.js            # Server entry point
```

## 🔌 API Endpoints

### Health Check
```
GET /api/v1/healthcheck
```
Returns server health status.

### User Management

#### Register
```
POST /api/v1/users/register
Body: { email, fullname, username, password }
Response: { accessToken, user }
```

#### Login
```
POST /api/v1/users/login
Body: { email, password }
Response: { accessToken, user }
```

#### Refresh Token
```
POST /api/v1/users/refresh-token
Returns: New access token
```

#### Logout
```
POST /api/v1/users/logout
Protected: ✅ Requires JWT
```

#### Get Current User
```
GET /api/v1/users/current-user
Protected: ✅ Requires JWT
```

#### Update User
```
PATCH /api/v1/users/update-account
Protected: ✅ Requires JWT
Body: { email, fullname, password }
```

#### Get User Channel
```
GET /api/v1/users/channel/:username
```

#### Get User Watch History
```
GET /api/v1/users/watch-history
Protected: ✅ Requires JWT
```

#### Update Avatar
```
PATCH /api/v1/users/avatar
Protected: ✅ Requires JWT
Form: multipart/form-data with avatar file
```

#### Update Cover Image
```
PATCH /api/v1/users/cover-image
Protected: ✅ Requires JWT
Form: multipart/form-data with cover image file
```

### Video Management

#### Upload Video
```
POST /api/v1/videos/upload
Protected: ✅ Requires JWT
Form: multipart/form-data
Fields: videoFile, thumbnail, title, description, duration, isPublished
```

#### Get All Videos
```
GET /api/v1/videos?page=1&limit=10&sortBy=createdAt&query=search
Query Parameters: page, limit, sortBy, query, userId
```

#### Get Video by ID
```
GET /api/v1/videos/:videoId
```

#### Get User Videos
```
GET /api/v1/videos/user/:userId?page=1&limit=10
```

#### Delete Video
```
DELETE /api/v1/videos/:videoId
Protected: ✅ Requires JWT (owner only)
```

#### Update Video
```
PATCH /api/v1/videos/:videoId
Protected: ✅ Requires JWT (owner only)
Body: { title, description, thumbnail, isPublished }
```

#### Toggle Publish Status
```
PATCH /api/v1/videos/:videoId/toggle-publish
Protected: ✅ Requires JWT (owner only)
```

#### Get Video Views
```
GET /api/v1/videos/:videoId/views
```

### Playlist Management

#### Create Playlist
```
POST /api/v1/playlists
Protected: ✅ Requires JWT
Body: { name, description }
```

#### Get All Playlists
```
GET /api/v1/playlists/all?page=1&limit=10&type=all
Query Parameters: page, limit, type (user/saved/all)
Protected: ✅ Requires JWT
```

#### Get Playlists by User
```
GET /api/v1/playlists/user/:videoId
Protected: ✅ Requires JWT
```

#### Get Playlist by ID
```
GET /api/v1/playlists/:playlistId
```

#### Update Playlist
```
PATCH /api/v1/playlists/:playlistId
Protected: ✅ Requires JWT (owner only)
Body: { name, description }
```

#### Delete Playlist
```
DELETE /api/v1/playlists/:playlistId
Protected: ✅ Requires JWT (owner only)
```

#### Add Video to Playlist
```
PATCH /api/v1/playlists/add/:videoId/:playlistId
Protected: ✅ Requires JWT
```

#### Remove Video from Playlist
```
PATCH /api/v1/playlists/remove/:videoId/:playlistId
Protected: ✅ Requires JWT
```

#### Save Playlist
```
PATCH /api/v1/playlists/save/:playlistId
Protected: ✅ Requires JWT
```

#### Get Saved Playlists
```
GET /api/v1/playlists/saved
Protected: ✅ Requires JWT
```

#### Watch Later Operations
```
PATCH /api/v1/playlists/watch-later/add/:videoId        # Add to watch later
PATCH /api/v1/playlists/watch-later/remove/:videoId     # Remove from watch later
GET /api/v1/playlists/watch-later                        # Get watch later playlist
GET /api/v1/playlists/watch-later/check/:videoId        # Check if in watch later
```

### Comments

#### Add Comment
```
POST /api/v1/comments/:videoId
Protected: ✅ Requires JWT
Body: { content }
```

#### Get Video Comments
```
GET /api/v1/comments/:videoId?page=1&limit=10
```

#### Delete Comment
```
DELETE /api/v1/comments/:commentId
Protected: ✅ Requires JWT (owner only)
```

#### Update Comment
```
PATCH /api/v1/comments/:commentId
Protected: ✅ Requires JWT (owner only)
Body: { content }
```

### Likes

#### Toggle Video Like
```
POST /api/v1/likes/toggle/v/:videoId
Protected: ✅ Requires JWT
```

#### Toggle Comment Like
```
POST /api/v1/likes/toggle/c/:commentId
Protected: ✅ Requires JWT
```

#### Toggle Playlist Like
```
POST /api/v1/likes/toggle/p/:playlistId
Protected: ✅ Requires JWT
```

#### Get Video Likes Count
```
GET /api/v1/likes/videos/:videoId
```

#### Get User Liked Videos
```
GET /api/v1/likes/videos?page=1&limit=10
Protected: ✅ Requires JWT
```

### Subscriptions

#### Toggle Subscription
```
POST /api/v1/subscriptions/c/:channelId
Protected: ✅ Requires JWT
```

#### Get Channel Subscribers
```
GET /api/v1/subscriptions/c/:channelId
```

#### Get User Subscriptions
```
GET /api/v1/subscriptions/u/:subscriberId?page=1&limit=10
```

### Tweets

#### Create Tweet
```
POST /api/v1/tweets
Protected: ✅ Requires JWT
Body: { content }
```

#### Get User Tweets
```
GET /api/v1/tweets/user/:userId?page=1&limit=10
```

#### Update Tweet
```
PATCH /api/v1/tweets/:tweetId
Protected: ✅ Requires JWT (owner only)
Body: { content }
```

#### Delete Tweet
```
DELETE /api/v1/tweets/:tweetId
Protected: ✅ Requires JWT (owner only)
```

### Dashboard

#### Get Channel Statistics
```
GET /api/v1/dashboard/stats
Protected: ✅ Requires JWT
Returns: { totalVideoViews, totalVideos, totalSubscribers, videos }
```

#### Get Videos by Channel
```
GET /api/v1/dashboard/videos?page=1&limit=10
Protected: ✅ Requires JWT
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  fullname: String,
  avatar: String (URL),
  coverImage: String (URL),
  password: String (hashed),
  refreshToken: String,
  watchHistory: [VideoId],
  savedPlaylists: [PlaylistId],
  createdAt: Date,
  updatedAt: Date
}
```

### Videos Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  duration: Number,
  videoFile: String (Cloudinary URL),
  thumbnail: String (Cloudinary URL),
  views: Number,
  isPublished: Boolean,
  owner: UserId,
  createdAt: Date,
  updatedAt: Date
}
```

### Playlists Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  videos: [VideoId],
  owner: UserId,
  isPrivate: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Comments Collection
```javascript
{
  _id: ObjectId,
  content: String,
  video: VideoId,
  owner: UserId,
  createdAt: Date,
  updatedAt: Date
}
```

### Likes Collection
```javascript
{
  _id: ObjectId,
  video: VideoId (optional),
  comment: CommentId (optional),
  playlist: PlaylistId (optional),
  likedBy: UserId,
  createdAt: Date
}
```

### Subscriptions Collection
```javascript
{
  _id: ObjectId,
  subscriber: UserId,
  channel: UserId,
  createdAt: Date
}
```

### Tweets Collection
```javascript
{
  _id: ObjectId,
  owner: UserId,
  content: String,
  createdAt: Date,
  updatedAt: Date
}
```

### VideoViews Collection
```javascript
{
  _id: ObjectId,
  video: VideoId,
  views: Number,
  createdAt: Date
}
```

## 🔐 Authentication

### JWT Token Flow

1. **Registration/Login**
   - User credentials validated
   - Access token (short-lived) and refresh token (long-lived) generated
   - Refresh token stored in database
   - Tokens sent to client in response

2. **Protected Routes**
   - Client includes access token in `Authorization` header
   - Middleware verifies token signature and expiration
   - User ID extracted from token payload
   - Request proceeds if valid

3. **Token Refresh**
   - Client calls `/api/v1/users/refresh-token` with refresh token
   - Server validates refresh token against database
   - New access token issued
   - Client updates stored token

4. **Logout**
   - Refresh token removed from database
   - Client clears stored tokens

### Token Claims
```javascript
{
  _id: "user_id",
  email: "user@example.com",
  username: "username",
  iat: 1234567890,
  exp: 1234654290  // 7 days
}
```

## 🛠️ Middleware

### Authentication Middleware (`auth.middleware.js`)

#### `verifyJWT`
- Validates JWT token from Authorization header or cookies
- Extracts user ID and attaches to request
- Returns 401 if token invalid or missing

```javascript
import { verifyJWT } from './middlewares/auth.middleware.js'

router.post('/protected-route', verifyJWT, controller)
```

#### `optionalVerifyJWT`
- Verifies JWT if present, but doesn't require it
- Allows both authenticated and unauthenticated requests

```javascript
router.get('/public-route', optionalVerifyJWT, controller)
```

### Error Middleware (`error.middleware.js`)
- Catches all errors thrown in controllers
- Returns standardized error response
- Logs errors to console

### File Upload Middleware (`multer.middleware.js`)
- Handles `multipart/form-data` requests
- Stores files in `public/temp/` directory
- Supports single and multiple file uploads

```javascript
import { upload } from './middlewares/multer.middleware.js'

// Single file
router.post('/upload', upload.single('avatar'), controller)

// Multiple files
router.post('/upload', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), controller)
```

## 📚 Utilities

### ApiResponse (`utils/apiResponse.js`)
Standardized response format:
```javascript
new ApiResponse(statusCode, data, message)

// Response structure
{
  statusCode: 200,
  data: { /* response data */ },
  message: "Success message",
  success: true
}
```

### ApiError (`utils/apiError.js`)
Custom error class for consistent error handling:
```javascript
throw new ApiError(400, "Error message")

// Returns error response
{
  statusCode: 400,
  message: "Error message",
  success: false
}
```

### asyncHandler (`utils/asyncHandler.js`)
Wrapper to catch async errors without try-catch:
```javascript
const getUser = asyncHandler(async (req, res) => {
  // Errors automatically caught and passed to error middleware
})
```

### Cloudinary Utilities (`utils/cloudinary.js`)
- `uploadOnCloudinary(localFilePath)` - Upload file to Cloudinary
- `deleteFromCloudinary(publicId)` - Delete file from Cloudinary
- Returns file URL or error

## 📦 Scripts

### Available Scripts

```bash
# Start development server with Nodemon
npm run dev

# Start production server
npm start

# Install dependencies
npm install

# Run ESLint (if configured)
npm run lint
```

### Development Tips

- Use Nodemon for auto-restart on file changes
- Check console logs for debugging
- Use MongoDB Compass for database inspection
- Test endpoints with Postman or cURL

## 🐛 Troubleshooting

### MongoDB Connection Errors

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solutions:**
- Verify MongoDB URI in `.env`
- Ensure MongoDB is running (local: `mongod`)
- Check MongoDB Atlas network access whitelist
- Verify firewall allows connection

### Cloudinary Upload Fails

**Error:** `Invalid Cloudinary credentials`

**Solutions:**
- Verify `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Check Cloudinary dashboard for correct values
- Ensure account isn't over quota
- Verify file size limits

### JWT Token Errors

**Error:** `JsonWebTokenError: invalid token`

**Solutions:**
- Verify `JWT_SECRET` is set correctly
- Check token isn't corrupted during transmission
- Ensure token hasn't expired
- Verify Authorization header format: `Bearer <token>`

### FFmpeg Not Found

**Error:** `ffmpeg/ffprobe not found`

**Solutions:**
- Install FFmpeg: `brew install ffmpeg` (Mac) or `apt-get install ffmpeg` (Linux)
- Set `FFMPEG_PATH` in `.env`
- Verify installation: `ffmpeg -version`

### Port Already in Use

**Error:** `Error: listen EADDRINUSE :::8000`

**Solutions:**
```bash
# Find process on port 8000
lsof -i :8000

# Kill process
kill -9 <PID>
```

### CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
- Verify `CORS_ORIGIN` matches frontend URL
- Check frontend is making requests to correct backend URL
- Ensure cookies are sent with `withCredentials: true`

## 📖 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [Cloudinary API](https://cloudinary.com/documentation)
- [FFmpeg Guide](https://ffmpeg.org/)

## 🤝 Contributing

1. Follow project structure conventions
2. Use async/await with asyncHandler wrapper
3. Return standardized ApiResponse
4. Include proper error handling
5. Add JSDoc comments for complex functions

## 📝 License

ISC License - See project root for details

---

**Built with ❤️ for learning full-stack development**