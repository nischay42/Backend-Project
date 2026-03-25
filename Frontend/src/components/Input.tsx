import { type InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  required?: boolean
  placeholderText?: string
  textColour?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    placeholderText='placeholder:text-gray-400', 
    error, 
    required, 
    type='text', 
    textColour='text-white', 
    className = '', 
    ...props 
  }, ref) => {

    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
      setInputType(showPassword ? 'password' : 'text')
    }

    const isPasswordType = type === 'password'
    const isEmailType = type === 'email'

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-white">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {isEmailType && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Mail className='w-5 h-5 text-gray-400' />
            </div>
          )}

        <input
          ref={ref}
          type={isPasswordType ? inputType : type}
          className={`
            w-full bg-transparent px-3 py-2.5 font-medium
            border focus:outline-none ${placeholderText} transition-colors 
            disabled:opacity-50 disabled:cursor-not-allowed focus:border-[#AE7AFF]
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${isEmailType ? 'pl-10' : ''}
            ${isPasswordType ? 'pr-10' : ''}
            ${textColour}
            ${className}
          `}
          {...props}
        />

        {isPasswordType && (
          <button
            type='button'
            onClick={togglePasswordVisibility}
            className='absolute right-3 top-6 -translate-y-1/2 text-gray-400 hover:text-white transition-colors'
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className='w-5 h-5' />
            ) : (
              <Eye className='w-5 h-5' />
            )} 
          </button>
        )}
      </div>

        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;