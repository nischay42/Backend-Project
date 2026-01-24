import { Outlet } from "react-router-dom";
import NavBar from "./navigation/Navbar";
import Sidebar from "./Sidebar/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
        <NavBar />
        <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4">
                <Outlet />
            </main>
        </div>
    </div>
  )
}

export default MainLayout