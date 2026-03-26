import { useState } from 'react'
import { useAppDispatch } from '../app/hooks'
import { login } from '../features/auth/authSlice'
import logo from "/Logo.svg"
import { Link } from 'react-router-dom'
import { useToastContext } from '../context/ToastContext'
import Input from '../components/Input'
import Button from '../components/Button'

const Login = () => {
    const dispatch = useAppDispatch()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToastContext()

    // ✅ Client-side validation
    const validateForm = () => {
        const newErrors = {
            email: '',
            password: ''
        }
        let isValid = true

        // Email validation
        if (!email.trim()) {
            newErrors.email = 'Email is required'
            isValid = false
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address'
            isValid = false
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required'
            isValid = false
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        // Clear previous errors
        setErrors({ email: '', password: '' })

        // Validate form
        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            await dispatch(login({ email, password })).unwrap()
            toast.success('Login successful!')
        } catch (error: any) {
            // ✅ Handle specific error types
            const errorMessage = error?.message || 'Login failed'
            const errorLower = errorMessage.toLowerCase()

            // Check if it's an invalid credentials error
            if (errorLower.includes('password') || errorLower.includes('incorrect')) {
                setErrors({ 
                    email: '', 
                    password: 'Incorrect password. Please try again.' 
                })
            } else if (errorLower.includes('email') || errorLower.includes('user not found') || errorLower.includes('not found')) {
                setErrors({ 
                    email: 'No account found with this email', 
                    password: '' 
                })
            } else if (errorLower.includes('credential') || errorLower.includes('invalid')) {
                setErrors({ 
                    email: 'Invalid email or password', 
                    password: 'Invalid email or password' 
                })
            } else {
                // Generic error - show in toast
                toast.error(errorMessage)
            }
        } finally {
            setIsLoading(false)
        }
    }

    // ✅ Clear error when user starts typing
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: '' }))
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: '' }))
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-black text-white px-4'>
            <form onSubmit={handleLogin} className="w-full max-w-md space-y-6">
                {/* Logo */}
                <div className='flex flex-col items-center mb-4'>
                    <Link to="/">
                        <img src={logo} className='cursor-pointer h-16' alt="logo" />
                    </Link>
                </div>

                {/* Email Input */}
                <Input 
                    value={email}
                    label='Email'
                    type="email"
                    placeholder='Enter your email'
                    required
                    onChange={handleEmailChange}
                    error={errors.email}
                    className='rounded'
                    placeholderText='placeholder:text-gray-500'
                />

                {/* Password Input */}
                <Input 
                    value={password}
                    placeholder='Enter your password'
                    type='password'
                    label='Password' 
                    required
                    onChange={handlePasswordChange}
                    error={errors.password}
                    className='rounded'
                    placeholderText='placeholder:text-gray-500'
                />

                {/* Forgot Password Link */}
                {/* <div className='text-right'>
                    <Link 
                        to="/forgot-password" 
                        className='text-purple-400 hover:text-purple-300 text-sm transition-colors'
                    >
                        Forgot Password?
                    </Link>
                </div> */}

                {/* Sign In Button */}
                <Button 
                    type='submit' 
                    className='w-full bg-[#AE7AFF] hover:bg-[#9c5ff0] transition-colors'
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className='flex items-center justify-center gap-2'>
                            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                            Signing in...
                        </span>
                    ) : (
                        'Sign in'
                    )}
                </Button>

                {/* Sign Up Link */}
                <p className='text-center text-gray-400'>
                    Don't have an account?{' '}
                    <Link 
                        to="/signup" 
                        className='text-purple-400 hover:text-purple-300 font-medium transition-colors'
                    >
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Login