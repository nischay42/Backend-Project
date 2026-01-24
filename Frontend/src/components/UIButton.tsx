import React from "react";

const UIButton = ({
  children = "",
  type = 'button',
  bgColor = "bg-[#AE7AFF]",
  textColor = "text-black",
  ...props
}) => {
  return (
      <button
      className={`
        relative
        font-semibold
        ${bgColor}
        ${textColor}
        px-5
        py-2.5
        shadow-[6px_6px_0px_#2E2A36]
        hover:translate-x-1
        hover:translate-y-1
        hover:shadow-[2px_2px_0px_#2E2A36]
        transition-all
        duration-200
        cursor-pointer
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default UIButton;
