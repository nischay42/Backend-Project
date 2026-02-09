import { NavLink } from "react-router-dom"

const ChannelTabs = () => {
    const tabs = [
        { name: "Videos", path: "" },
        { name: "Playlist", path: "playlist" },
        { name: "Tweets", path: "tweets" },
        { name: "Subscribers", path: "subscribers" },
    ]
  return (
    <div className="flex w-[80vw] h-12 gap-3 mt-3.5">
       {tabs.map(tab => (
           <NavLink
             key={tab.path}
             to={tab.path}
             end
             className={({ isActive }) => 
                `flex items-center justify-center w-70 h-11 
                 cursor-pointer font-semibold transition-all duration-300
                ${isActive
                ? "border border-b-2 text-[#AE7AFF] bg-white"
                : "text-gray-400 hover:text-[#AE7AFF] hover:border hover:border-[#AE7AFF] border-black"
                }`
             }
           >
            {tab.name}
           </NavLink>
       ))}
        
    </div>
  )
}

export default ChannelTabs