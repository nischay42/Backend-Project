import { Outlet, NavLink, useLocation } from "react-router-dom"

const SettingLayout = () => {
  const location = useLocation()
  const isMyDetailsTab = location.pathname === '/setting'

  return (
    <div className="h-screen w-full lg:px-10 py-7 lg:pl-20">
      <h1 className='font-medium px-2 lg:px-0 text-3xl mb-3 lg:mb-5'>Settings</h1>
      <div className="bg-white lg:h-px mr-7 lg:mb-5 "/>
      <div className="lg:flex lg:justify-between">
        <div className="flex lg:flex-col px-2 py-2 gap-4 w-40">
            <NavLink
              to='/setting'
            >
               <button 
                className={`rounded-lg whitespace-nowrap border lg:border-none px-3
                  py-1.5 hover:bg-[#101014] ${isMyDetailsTab ? 'text-[#AE7AFF]' : 'text-white'}`}
                >My details</button>
            </NavLink>
            <NavLink
              to='password'
            >
               <button 
                className={`rounded-lg whitespace-nowrap border lg:border-none px-3 
                py-1.5 hover:bg-[#101014] ${!isMyDetailsTab ? 'text-[#AE7AFF]' : 'text-white'}`}
                >Password</button>
            </NavLink>
        </div>
        <div className="">
            <Outlet />
        </div>
      </div>
    </div>
  )
}

export default SettingLayout