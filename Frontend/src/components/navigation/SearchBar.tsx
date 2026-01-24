import React from 'react'

const SearchBar = () => {
  return (
<div className="w-full max-w-3/9 ml-32">
  <div className="flex items-center gap-3 border border-white rounded-md px-3 py-2">
      <button className='cursor-pointer flex items-center'>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
        />
        </svg>
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