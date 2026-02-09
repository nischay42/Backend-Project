import { useState } from 'react';

interface ToggleSwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const ToggleSwitch = ({ label, checked = false, onChange }: ToggleSwitchProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-white">{label}</span>}
      <button
        type="button"
        onClick={handleToggle}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-200 ease-in-out focus:outline-none
          ${isChecked ? 'bg-[#AE7AFF]' : 'bg-gray-600'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white
            transition-transform duration-200 ease-in-out
            ${isChecked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;