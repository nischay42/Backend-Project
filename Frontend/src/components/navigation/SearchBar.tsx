import { search } from '../../assets'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    navigate(`/results?search_query=${searchQuery.trim()}`)
  }

  return (
<div className="w-full max-w-3/9 lg:ml-32">
  <form action={handleSearch}>
    <div className="flex items-center gap-3 border border-white rounded-md px-3 py-2">
      <button type='submit' className='cursor-pointer flex items-center'>
       <img src={search} alt="searchIcon" />
      </button>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value)
        }}
        className="w-full bg-transparent text-white placeholder-white focus:outline-none"
      />
    </div>
  </form>
</div>

  )
}

export default SearchBar