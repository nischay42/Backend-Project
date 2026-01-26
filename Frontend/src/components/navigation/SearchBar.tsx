import { search } from '../../assets/index'

const SearchBar = () => {
  return (
<div className="w-full max-w-3/9 ml-32">
  <div className="flex items-center gap-3 border border-white rounded-md px-3 py-2">
      <button className='cursor-pointer flex items-center'>
       <img src={search} alt="searchIcon" />
      </button>
    <input
      type="text"
      placeholder="Search"
      className="w-full bg-transparent text-white placeholder-white focus:outline-none"
    />
  </div>
</div>

  )
}

export default SearchBar