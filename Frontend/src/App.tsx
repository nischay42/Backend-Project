import { getHealthStatus } from "./api/healthCheck.api"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react'
import { useAppDispatch } from "./app/hooks";
import { fetchCurrentUser } from "./features/auth/authSlice";
import { ProtectedRoute, MainLayout, AuthLayout, ChannelLayout} from "./layout/index";
import { Home, Login, Signup, LikedVideo, Setting, Support, History, Subscribers, Following, VideoPlayer } from "./pages/index";
import { ToastProvider } from "./context/ToastContext";
import Videos from "./pages/channel/Videos";
import Playlist from "./pages/channel/Playlist";
import Tweets from "./pages/channel/Tweets";
import UploadVideo from "./pages/channel/UploadVideo";

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    getHealthStatus()
      .then((data) => console.log("Health Check", data))
      .catch((err) => console.log("API error", err))
  }, [])
  
  useEffect(() => {
    dispatch(fetchCurrentUser())
    
  }, [])
  
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
    
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
    
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/support" element={<Support />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/watch" element={<VideoPlayer />} />
          </Route>
          
          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/liked-videos" element={<LikedVideo />}></Route>
            <Route path="/:username" element={<ChannelLayout />}>
              <Route index element={<Videos />} />
              <Route path="playlist" element={<Playlist />} />
              <Route path="tweets" element={<Tweets />} />
              <Route path="subscribers" element={<Following />} />
              <Route path="upload" element={
                <ProtectedRoute>
                  <UploadVideo />
                </ProtectedRoute>} 
              />
            </Route>
            <Route path="/history" element={<History />}></Route>
            <Route path="/subscribers" element={<Subscribers />}></Route>
          </Route>

    
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
