import SearchBar from './SearchBar'
import UserMenu from './UserMenu'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logout } from '../../features/auth/authSlice'
import UIButton from '../UIButton'
import logo from "../../../public/Logo.svg"
import type { RootState } from '../../app/store'
import { profile } from '../../assets'

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const avatar  = useAppSelector((state: RootState) => state.auth.user?.avatar)
  const username  = useAppSelector((state: RootState) => state.auth.user?.username)
  const fullname  = useAppSelector((state: RootState) => state.auth.user?.fullname)
  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
  }

  return (
    <nav>
      <div className='w-full relative h-16 border-b-white border-b flex items-center justify-between'>
        <div className="">
          <img src={logo} className='ml-3 lg:ml-10 cursor-pointer' onClick={() => navigate("/")} alt="logo" />
        </div>
        <SearchBar />
        <div className='flex items-center mr-3 lg:mr-15'>
          <div className='flex items-center gap-2'>
            {!isAuthenticated ? (
              <>
              <Link 
                to="/login"
                className='lg:px-6 lg:py-2.5 cursor-pointer'
              >
                Log in
              </Link>

              <Link 
                to="/signup"
                className='mb-2'
              >
               <UIButton 
                children='Sign up' 
                padding='px-2 py-2 lg:px-5 lg:py-2.5'
               />
              </Link>
              </>
           ) : (
              <>
                <Link to={`/@${username}`}>
                  <img 
                    src={avatar || profile} 
                    className='h-10 w-10 rounded-full object-cover'
                  />
                </Link>

                <UserMenu 
                  avatar={avatar}
                  fullname={fullname}
                  username={username}
                  onLogout={handleLogout}
                />
              </>
            )}
            
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar