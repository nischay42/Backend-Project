import React from 'react'

interface ButtonProps  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    bgColor?: string
    textColor?: string
    icon?: string
    className?: string
    padding?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  bgColor = "bg-[#AE7AFF]",
  textColor = "text-black",
  icon,
  className,
  padding = "px-5 py-2.5",
  ...props
}) => {
  return (
 <button
  type="button"
  className={`
    flex
    items-center
    justify-center
    font-semibold
    ${bgColor}
    ${textColor}
    ${padding}
    ${className}
    cursor-pointer
    transition-all
    duration-200
    ease-in-out
    active:scale-95
    hover:scale-105
    shadow-lg
    hover:shadow-xl
    active:shadow-md
  `}
  {...props}
>
  {icon &&
    <img src={icon} className='mr-2' />
  }
  {children}
</button>
  )
}

export default Button