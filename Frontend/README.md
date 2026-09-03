# Frontend - Play React Application

A modern, fully-featured frontend for Play video streaming platform built with React 19, TypeScript, Redux Toolkit, and Tailwind CSS.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Component Overview](#component-overview)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Scripts](#scripts)
- [Styling](#styling)
- [Performance](#performance)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

```bash
npm install
npm run dev
```

Application runs on `http://localhost:5173`

## ✨ Features

### User Management
- ✅ User Registration with validation
- ✅ Login/Logout functionality
- ✅ User profile management
- ✅ Password update
- ✅ Avatar and cover image upload
- ✅ Watch history tracking

### Video Features  
- ✅ Video upload with progress
- ✅ Video streaming with player
- ✅ Search functionality
- ✅ Video filtering
- ✅ Trending videos

### Social Features
- ✅ Like/Unlike videos
- ✅ Comments with threading
- ✅ Subscribe to channels
- ✅ Create & manage playlists
- ✅ Watch Later list

### UI/UX
- ✅ Responsive design (mobile-first)
- ✅ Skeleton loading states
- ✅ Toast notifications
- ✅ Error handling

## 🔧 Environment Variables

```env
VITE_API_URL=http://localhost:8000
```

## 📁 Project Structure

```
src/
├── api/          # API client functions
├── app/          # Redux store
├── features/     # Redux slices
├── components/   # Reusable components
├── pages/        # Page components
├── context/      # React Context
├── hooks/        # Custom hooks
├── utils/        # Utilities
└── assets/       # Static files
```

## 📦 Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview build
npm run lint      # Run ESLint
```

## 📝 License

ISC License

---

**Built with ❤️ using React + TypeScript + Redux**

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
