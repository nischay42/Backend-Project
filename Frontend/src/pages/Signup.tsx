import { useState } from 'react'
import { useAppDispatch } from '../app/hooks'
import { signup } from '../features/auth/authSlice'
import logo from "../../public/Logo.svg"
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react';
import { useToastContext } from '../context/ToastContext'

// fullname, email, username, passwor

const Signup = () => {
    const toast = useToastContext()
    const dispatch = useAppDispatch();
    const [fullname, setfullname] = useState("")
    const [username, setusername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleSignup = async () => {
        try {
            await dispatch(signup({fullname, username, email, password, })).unwrap()
            toast.success("Account created successfully")
        } catch (error: any) {
            toast.error(error?.message || "Signup failed")
        }
    }
  return (
    <div className='min-h-screen flex justify-center bg-black text-white'>
      <form action={handleSignup}>
        <div className="w-96 space-y-4">
            <div className='flex flex-col items-center mt-15'>
            <Link to="/">
                <img src={logo} className='cursor-pointer' alt="logo" />
            </Link>

            </div>
            <label htmlFor="fullName">Name*</label>
            <input 
            type="input"
            name='fullName'
            placeholder='Enter your Name'
            className='w-full px-3 py-2 bg-black border rounded'
            value={fullname}
            required
            onChange={(e) => setfullname(e.target.value)}
            />

            <label htmlFor="fullName">Username*</label>
            <input 
            type="input"
            name='fullName'
            placeholder='Enter a Username'
            className='w-full px-3 py-2 bg-black border rounded'
            value={username}
            required
            onChange={(e) => setusername(e.target.value)}
            />

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

            <h3>Already have an account? <Link to="/login">Sign In</Link></h3>

            <button
            type='submit'
            className='w-full bg-[#AE7AFF] py-2 text-black font-semibold'
            >
                Sign in
            </button>

        </div>
      </form>
    </div>
  )
}

export default Signup