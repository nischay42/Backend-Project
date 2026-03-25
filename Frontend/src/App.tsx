import { getHealthStatus } from "./api/healthCheck.api"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from 'react'
import { useAppDispatch } from "./app/hooks";
import { fetchCurrentUser } from "./features/auth/authSlice";
import { ProtectedRoute, MainLayout, AuthLayout, ChannelLayout, 
        SettingLayout, SubscriberLayout, PlaylistLayout
      } from "./layout/index";
import { Home, Login, Signup, LikedVideo, WatchLater,
         Support, History, Following, VideoPlayer, Dashboard, 
         PlaylistDetail, SearchResult
      } from "./pages/index";
import { ToastProvider } from "./context/ToastContext";
import Videos from "./pages/channel/Videos";
import ChannelPlaylist from "./pages/channel/Playlist";
import Tweets from "./pages/channel/Tweets";
import UploadVideo from "./pages/channel/UploadVideo";
import MyDetails from "./pages/Settings/MyDetails";
import Password from "./pages/Settings/Password";
import Subscriber from "./pages/Subscriber/Subscriber";
import AllSubscribers from "./pages/Subscriber/AllSubscribers";
import AllPlaylist from "./pages/Playlist/AllPlaylist";
import UserPlaylist from "./pages/Playlist/UserPlaylist";
import { useAppSelector } from "./app/hooks";

function App() {
  const dispatch = useAppDispatch()
    const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    getHealthStatus()
      .then((data) => console.log("Health Check", data))
      .catch((err) => console.log("API error", err))
  }, [])
  
  useEffect(() => {
    if (!isAuthenticated) return
    dispatch(fetchCurrentUser())
    
  }, [])
  
  function ScrollToTop() {
    const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
    return null;
  }

  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
    
          {/* Authenticated routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Public view routes */}
          <Route element={<MainLayout />}>

            <Route path="/" element={<Home />} />

            <Route path="/support" element={<Support />} />

            <Route path="/results" element={<SearchResult />} />

            <Route path="/watch" element={<VideoPlayer />} />

            <Route path="/playlist-view" element={<PlaylistDetail />} />

            <Route path="/:username" element={<ChannelLayout />}>
              <Route index element={<Videos />} />
              <Route path="playlist" element={<ChannelPlaylist />} />
              <Route path="tweets" element={<Tweets />} />
              <Route path="subscribers" element={<Following />} />
              <Route path="upload" element={
                <ProtectedRoute>
                  <UploadVideo />
                </ProtectedRoute>} 
              />
            </Route>
            
            <Route path='/setting' element={<SettingLayout />}>
              <Route index element={
                <ProtectedRoute>
                  <MyDetails />
                </ProtectedRoute>
                } 
                />
              <Route path='password' element={
                <ProtectedRoute>
                  <Password />
                </ProtectedRoute>
                } 
                />
            </Route>

          </Route>
          {/* Protected routes */}
          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>

            <Route path="/liked-videos" element={<LikedVideo />} />

            <Route path="/history" element={<History />} />

            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/watch-later" element={<WatchLater />} />
            
            <Route path="/playlist" element={<PlaylistLayout />} >
                <Route index element={<AllPlaylist />} />
                <Route path='owned' element={<UserPlaylist />} />
            </Route>
            
            <Route path='/subscribers' element={<SubscriberLayout />} >
                <Route index element={<AllSubscribers />} />
                <Route path=':username' element={<Subscriber />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
