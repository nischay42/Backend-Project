import { Outlet } from "react-router-dom";
import NavBar from "../components/navigation/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
        <NavBar />
        <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    </div>
  )
}

export default MainLayout