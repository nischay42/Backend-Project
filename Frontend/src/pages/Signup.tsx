import { useState } from 'react'
import { useAppDispatch } from '../app/hooks'
import { signup } from '../features/auth/authSlice'
import logo from "../../public/Logo.svg"
import { Link } from 'react-router-dom'

// fullname, email, username, passwor

const Signup = () => {
    const dispatch = useAppDispatch();
    const [fullname, setfullname] = useState("")
    const [username, setusername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = () => {
        dispatch(signup({fullname, username, email, password, }))
    }
// fullname, email, username, password
  return (
    <div className='min-h-screen flex justify-center bg-black text-white'>
        <div className="w-96 space-y-4">
            <div className='flex flex-col items-center mt-15'>
            <img src={logo} className='cursor-pointer' alt="logo" />
            {/* <h1 className="text-3xl font-semibold tracking-[1px]">PLAY</h1> */}

            </div>
             
            <label htmlFor="fullName">Name*</label>
            <input 
            type="input"
            name='fullName'
            placeholder='Enter your Name'
            className='w-full px-3 py-2 bg-black border rounded'
            value={fullname}
            onChange={(e) => setfullname(e.target.value)}
            />

            <label htmlFor="fullName">Username*</label>
            <input 
            type="input"
            name='fullName'
            placeholder='Enter a Username'
            className='w-full px-3 py-2 bg-black border rounded'
            value={username}
            onChange={(e) => setusername(e.target.value)}
            />

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

            <h3>Already have an account? <Link to="/login">Sign In</Link></h3>

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

export default Signup