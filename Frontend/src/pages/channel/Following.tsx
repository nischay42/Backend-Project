import FollowingCard from '../../components/Following/FollowingCard'
import { search } from '../../assets'

const Following = () => {
  return (
    <div className="transition-all duration-500 w-[80vw]">
      <div className="flex items-center gap-3 border border-[#D0D5DD] px-3 py-2 w-full mb-6">
        <button className='cursor-pointer flex items-center'>
         <img src={search} alt="searchIcon" />
        </button>
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent text-white placeholder-white focus:outline-none"
        />
      </div>
      <FollowingCard />
      <FollowingCard />
      <FollowingCard />
      <FollowingCard />
      <FollowingCard />
      <FollowingCard />
    </div>
  )
}

export default Following