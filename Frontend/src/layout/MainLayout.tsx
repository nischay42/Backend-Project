import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/navigation/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import SnackBar from "../components/Sidebar/SnackBar";
import HamburgerMenu from "../components/Sidebar/HamburgerMenu";
import useScrollToTop from "../hooks/useScrollToTop";

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
    
    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [isMobileMenuOpen])

  useScrollToTop(mainRef)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-white">
      <NavBar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main ref={mainRef} className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          <Outlet />
        </main>
      </div>

      <SnackBar onMenuClick={() => setIsMobileMenuOpen(true)} />
      <HamburgerMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </div>
  )
}

export default MainLayout