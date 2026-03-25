import { Outlet, NavLink, useLocation } from 'react-router-dom'
import Button from '../components/Button'

const PlaylistLayout = () => {
  const location = useLocation()
  const isAllPlaylistTab = location.pathname === '/playlist'
  return (
    <div className="p-2 lg:p-5">
        <div className='text-4xl font-medium'>Playlists</div>
        <div className="flex gap-4 mt-7">
            <NavLink
              to='/playlist'
            >
            <Button 
                children='All Playlists' 
                bgColor='transparent' 
                textColor='white' 
                className={`border rounded-lg ${isAllPlaylistTab ? 'text-[#AE7AFF]' : 'text-white'}`} 
                padding='px-2.5 py-2' 
            />
            </NavLink>
            <NavLink
              to='owned'
            >
            <Button 
                children='Owned' 
                bgColor='transparent' 
                textColor='white' 
                className={`border rounded-lg ${!isAllPlaylistTab ? 'text-[#AE7AFF]' : 'text-white'}`} 
                padding='px-2.5 py-2' 
            />
            </NavLink>
        </div>
        <div className="">
            <Outlet />
        </div>
    </div>
  )
}

export default PlaylistLayout