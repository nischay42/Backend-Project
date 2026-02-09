type ButtonProps = {
  label?: string
  icon: string
  className?: string
  showLabel?: boolean
};

const Button = ({label, icon, className, showLabel=true}: ButtonProps) => {
  return (
    <div className="">
        <button className={`flex items-center gap-2.5 border border-white w-full my-1 p-1 cursor-pointer  ${className}`}>
            <img src={icon} alt="" className="ml-1" />
              {showLabel && <span className={`
                text-white whitespace-nowrap
                transition-all duration-700 ease-in-out
                ${showLabel 
                 ? 'opacity-100 w-auto' 
                 : 'opacity-0 w-0 overflow-hidden'
                }
              `}>{label}</span>}
        </button>
    </div>
  )
}

export default Button