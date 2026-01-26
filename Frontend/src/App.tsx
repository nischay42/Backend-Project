import { getHealthStatus } from "./api/healthCheck.api"
import { userLogin, userLogout } from "./api/user.api";
import Sidebar from "./components/Sidebar/Sidebar";
import NavBar from "./components/navigation/Navbar";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react'
import { useAppDispatch } from "./app/hooks";
import { fetchCurrentUser } from "./features/auth/authSlice";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";
import { Home, Login, Signup, MyChannel, LikedVideo, Setting, Support, History, Subscribers } from "./pages/index";
import { ToastProvider } from "./context/ToastContext";

function App() {

  useEffect(() => {
    getHealthStatus()
      .then((data) => console.log("Health Check", data))
      .catch((err) => console.log("API error", err))
  }, [])
  

  // function login() {
  //   const user = {email: "one@gmai.com", password: "123456789"}
  //   userLogin(user)
  //     .then((data) => console.log("Login successfully", data))
  //     .catch((err) => console.log("Login Error", err))
  // }

  // function logout() {
  //   userLogout()
  //     .then((data) => console.log("logout successfully",data))
  //     .catch((err) => console.log("logout err", err))
  // }

  const dispatch = useAppDispatch()

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
            {/* <Route /> */}
          </Route>
          
          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/liked-videos" element={<LikedVideo />}></Route>
            <Route path="/history" element={<History />}></Route>
            <Route path="/channel" element={<MyChannel />}></Route>
            <Route path="/subscribers" element={<Subscribers />}></Route>
          </Route>

    
        </Routes>
      </BrowserRouter>
    </ToastProvider>
    // <>
    // {/* <div className="h-screen">
    // <h1 className="text-center text-2xl">Hello World</h1>
    // <button onClick={()=> login()}>Login</button>
    // <button onClick={()=> logout()}>Logout</button>

    // </div> */}
    // <main className="h-screen bg-black text-white">
    //   {/* <NavBar />
    //   <Sidebar /> */}
    //   <MainLayout />
    // </main>

    // </>
  )
}

export default App
