interface ButtonProps  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    bgColor?: string
    textColor?: string
    icon?: string
    className?: string
    padding?: string
    imgClass?: string
}

const UIButton = ({
  children,
  bgColor = "bg-[#AE7AFF]",
  textColor = "text-black",
  icon,
  className,
  padding = "px-5 py-2.5",
  imgClass,
  ...props
}: ButtonProps) => {
  return (
      <button
      type='button'
      className={`
        flex
        items-center
        relative
        font-semibold
        ${bgColor}
        ${textColor}
        ${padding}
        ${className}
        shadow-[6px_6px_0px_#2E2A36]
        active:translate-x-1
        active:translate-y-1
        active:shadow-[2px_2px_0px_#2E2A36]
        transition-all
        ease-in-out
        duration-75
        cursor-pointer
      `}
      {...props}
    >
       <img src={icon} className={imgClass} />
      {children}
    </button>
  );
};

export default UIButton;
