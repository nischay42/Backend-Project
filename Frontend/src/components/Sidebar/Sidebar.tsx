import {
    collection,
    history,
    home,
    like,
    content,
    setting,
    subscriber,
    support
} from "../../assets/index.ts"
import Button from './Button.tsx'
import { useAppSelector } from "../../app/hooks.ts"
import { Link } from "react-router-dom"

const Sidebar = () => {

const { isAuthenticated } = useAppSelector((state) => state.auth)
const sidebarTabs = [
  { label: "Home", icon: home, path: "/", group: "top", isVisible: true },
  { label: "Liked Video", icon: like, path: "/liked-videos", group: "top", isVisible: isAuthenticated },
  { label: "History", icon: history, path: "/history", group: "top", isVisible: isAuthenticated },
  { label: "My Channel", icon: content, path: "/channel", group: "top", isVisible: isAuthenticated },
  { label: "Collection", icon: collection, path: "/collection", group: "top", isVisible: isAuthenticated },
  { label: "Subscribers", icon: subscriber, path: "/subscribers", group: "top", isVisible: isAuthenticated },

  { label: "Support", icon: support, path: "/support", group: "bottom" },
  { label: "Setting", icon: setting, path: "/setting", group: "bottom" },
  ]

  const topTabs = sidebarTabs.filter(tab => tab.group === "top")
  const bottomTabs = sidebarTabs.filter(tab => tab.group === "bottom")



  return (
    <div className='flex flex-col justify-between h-full w-1/6 border-white border-r p-2'>
      <ul>
        {topTabs.map((item) => 
          (item.isVisible ? 
              <li
              key={item.label}
              >
                <Link to={item.path}>
                    <Button icon={item.icon} label={item.label} />
                </Link>
              </li>
           : 
           null)
        )}
      </ul>
      <ul>
        
        {bottomTabs.map((item) => (
          <li
              key={item.label}
            >
              <Link to={item.path}>
                  <Button icon={item.icon} label={item.label} />
              </Link>
            </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar