import { useState } from 'react'
import { useAppDispatch } from '../app/hooks'
import { login } from '../features/auth/authSlice'
import logo from "../../public/Logo.svg"
import { Link } from 'react-router-dom'

const Login = () => {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = () => {
        dispatch(login({email, password}))
    }

  return (
    <div className='min-h-screen flex justify-center bg-black text-white'>
        <div className="w-96 space-y-4">
            <div className='flex flex-col items-center mt-15'>
            <img src={logo} className='cursor-pointer' alt="logo" />
            {/* <h1 className="text-3xl font-semibold tracking-[1px]">PLAY</h1> */}

            </div>
             
            <label htmlFor="email">Email*</label>
            <input 
            type="email"
            name='email'
            placeholder='Enter your email'
            className='w-full px-3 py-2 bg-black border rounded'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password*</label>
            <input 
            type="password"
            name='password'
            placeholder='Enter your password'
            className='w-full px-3 py-2 bg-black border rounded'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <h3>Don't have any account? <Link to="/signup"> Sign Up </Link></h3>

            <button
            onClick={handleLogin}
            className='w-full bg-[#AE7AFF] py-2 text-black font-semibold'
            >
                Sign in
            </button>
        </div>
    </div>
  )
}

export default Login