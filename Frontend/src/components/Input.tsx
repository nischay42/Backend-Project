import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-white">
            {label}
            {required && <span>*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-transparent text-white p-3 
            border focus:outline-none placeholder:text-gray-500
            disabled:opacity-50 disabled:cursor-not-allowed focus:border-[#AE7AFF]
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;