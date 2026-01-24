type ButtonProps = {
  label: string,
  icon: string
};

const Button = ({label, icon}: ButtonProps) => {
  return (
    <div className="">
        <button className="flex items-center gap-2.5 border w-full my-1 p-1 cursor-pointer">
            <img src={icon} alt="" className="ml-1" />
            <span>{label}</span>
        </button>
    </div>
  )
}

export default Button