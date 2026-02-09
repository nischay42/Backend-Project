import SearchBar from './SearchBar'
import UserMenu from './UserMenu'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logout } from '../../features/auth/authSlice'
import UIButton from '../UIButton'
import logo from "../../../public/Logo.svg"

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
  }

  return (
    <nav>
      <div className='w-full h-16 border-b-white border-b flex items-center justify-between'>
        <div className="">
          <img src={logo} className='ml-10 cursor-pointer' onClick={() => navigate("/")} alt="logo" />
        </div>
        <SearchBar />
        <div className='flex items-center mr-15'>
          <UserMenu />
          <div className='flex'>
            {!isAuthenticated ? (
              <>
              <Link 
                to="/login"
                className='px-6 py-2.5 cursor-pointer'
              >
                Log in
              </Link>

              <Link 
                to="/signup"
                className='mb-2'
              >
               <UIButton children='Sign up' />
              </Link>
              </>
            ) : (
              <Link
                to="/"
                className='mb-3'
              >
                <UIButton children='Logout' onClick={handleLogout} />
              </Link>
            )}
            
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar