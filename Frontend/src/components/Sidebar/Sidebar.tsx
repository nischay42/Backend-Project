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

const Sidebar = () => {

const sidebarTabs = [
  { label: "Home", icon: home, path: "/", group: "top" },
  { label: "Like Video", icon: like, path: "/liked", group: "top" },
  { label: "History", icon: history, path: "/history", group: "top" },
  { label: "My Content", icon: content, path: "/content", group: "top" },
  { label: "Collection", icon: collection, path: "/collection", group: "top" },
  { label: "Subscribers", icon: subscriber, path: "/subscribers", group: "top" },

  { label: "Support", icon: support, path: "/support", group: "bottom" },
  { label: "Setting", icon: setting, path: "/setting", group: "bottom" },
  ]

  const topTabs = sidebarTabs.filter(tab => tab.group === "top")
  const bottomTabs = sidebarTabs.filter(tab => tab.group === "bottom")



  return (
    <div className='flex flex-col justify-between h-full w-1/6 border-white border-r p-2'>
      <ul>
        {topTabs.map((item) => (
          <li
            key={item.label}
            // path={item.path}
          >
            <Button icon={item.icon} label={item.label} />
          </li>
        ))}
      </ul>
      <ul>
        
        {bottomTabs.map((item) => (
          <li
            key={item.label}
            // path={item.path}
          >
            <Button icon={item.icon} label={item.label} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar