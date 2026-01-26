import { useState } from 'react'
import { useAppDispatch } from '../app/hooks'
import { login } from '../features/auth/authSlice'
import logo from "../../public/Logo.svg"
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react';
import { useToastContext } from '../context/ToastContext'

const Login = () => {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const toast = useToastContext()

    const handleLogin = async () => {
        try {
            await dispatch(login({ email, password })).unwrap();
            toast.success('Login successful!', 2500);
        } catch (error: any) {
            toast.error(error?.message || 'Login failed', 4000);
        }
    }

  return (
    <div className='min-h-screen flex justify-center bg-black text-white'>
      <form action={handleLogin}>
        <div className="w-96 space-y-4">
            <div className='flex flex-col items-center mt-15'>
            <Link to="/">
                <img src={logo} className='cursor-pointer' alt="logo" />
            </Link>

            </div>
            <label htmlFor="email">Email*</label>
            <input 
            type="email"
            name='email'
            placeholder='Enter your email'
            className='w-full px-3 py-2 bg-black border rounded'
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password*</label>
            <div className="relative w-full">
                <input 
                type={showPassword ? "text" : "password"}
                name='password'
                placeholder='Enter your password'
                className='w-full px-3 py-2 bg-black border rounded'
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                />
                
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                {showPassword ? (
                    <EyeOff size={20} />
                ) : (
                    <Eye size={20} />
                )}
                </button>
            </div>

            <h3>Don't have any account? <Link to="/signup"> Sign Up </Link></h3>

            <button
            type='submit'
            className='w-full bg-[#AE7AFF] py-2 text-black font-semibold cursor-pointer'
            >
                Sign in
            </button>
        </div>
      </form>
    </div>
  )
}

export default Login