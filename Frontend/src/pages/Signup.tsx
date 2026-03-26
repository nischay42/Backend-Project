import { useState } from 'react'
import { useAppDispatch } from '../app/hooks'
import { signup } from '../features/auth/authSlice'
import logo from "/Logo.svg"
import { Link } from 'react-router-dom'
import { useToastContext } from '../context/ToastContext'
import Input from '../components/Input'
import Button from '../components/Button'
import { CheckCircle2, XCircle } from 'lucide-react'

const Signup = () => {
    const toast = useToastContext()
    const dispatch = useAppDispatch()
    
    const [fullname, setFullname] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const [errors, setErrors] = useState({
        fullname: '',
        username: '',
        email: '',
        password: ''
    })
    
    const [isLoading, setIsLoading] = useState(false)
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)

    // ✅ Password validation criteria
    const passwordRequirements = {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }

    const isPasswordValid = Object.values(passwordRequirements).every(Boolean)

    // ✅ Comprehensive validation
    const validateForm = () => {
        const newErrors = {
            fullname: '',
            username: '',
            email: '',
            password: ''
        }
        let isValid = true

        // Fullname validation
        if (!fullname.trim()) {
            newErrors.fullname = 'Full name is required'
            isValid = false
        } else if (fullname.trim().length < 2) {
            newErrors.fullname = 'Full name must be at least 2 characters'
            isValid = false
        } else if (fullname.trim().length > 50) {
            newErrors.fullname = 'Full name must be less than 50 characters'
            isValid = false
        } else if (!/^[a-zA-Z\s]+$/.test(fullname.trim())) {
            newErrors.fullname = 'Full name can only contain letters and spaces'
            isValid = false
        }

        // Username validation
        if (!username.trim()) {
            newErrors.username = 'Username is required'
            isValid = false
        } else if (username.trim().length < 3) {
            newErrors.username = 'Username must be at least 3 characters'
            isValid = false
        } else if (username.trim().length > 20) {
            newErrors.username = 'Username must be less than 20 characters'
            isValid = false
        } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
            newErrors.username = 'Username can only contain letters, numbers, and underscores'
            isValid = false
        } else if (/^\d/.test(username.trim())) {
            newErrors.username = 'Username cannot start with a number'
            isValid = false
        }

        // Email validation
        if (!email.trim()) {
            newErrors.email = 'Email is required'
            isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            newErrors.email = 'Please enter a valid email address'
            isValid = false
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required'
            isValid = false
        } else if (!isPasswordValid) {
            newErrors.password = 'Password does not meet all requirements'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        // Clear previous errors
        setErrors({
            fullname: '',
            username: '',
            email: '',
            password: ''
        })

        // Validate form
        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            await dispatch(signup({ 
                fullname: fullname.trim(), 
                username: username.trim().toLowerCase(), 
                email: email.trim().toLowerCase(), 
                password 
            })).unwrap()
            
            toast.success("Account created successfully!")
        } catch (error: any) {
            const errorMessage = error?.message || "Signup failed"
            const errorLower = errorMessage.toLowerCase()
            

            // ✅ Handle specific backend errors
            if (errorLower.includes('email') && errorLower.includes('exist')) {
                setErrors(prev => ({ 
                    ...prev, 
                    email: 'This email is already registered' 
                }))
            } else if (errorLower.includes('username') && errorLower.includes('exist')) {
                setErrors(prev => ({ 
                    ...prev, 
                    username: 'This username is already taken' 
                }))
            } else if (errorLower.includes('email')) {
                setErrors(prev => ({ 
                    ...prev, 
                    email: errorMessage 
                }))
            } else if (errorLower.includes('username')) {
                setErrors(prev => ({ 
                    ...prev, 
                    username: errorMessage 
                }))
            } else if (errorLower.includes('password')) {
                setErrors(prev => ({ 
                    ...prev, 
                    password: errorMessage 
                }))
            } else if (errorLower.includes('fullname') || errorLower.includes('name')) {
                setErrors(prev => ({ 
                    ...prev, 
                    fullname: errorMessage 
                }))
            } else {
                toast.error(errorMessage)
            }
        } finally {
            setIsLoading(false)
        }
    }

    // ✅ Clear errors when typing
    const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFullname(e.target.value)
        if (errors.fullname) {
            setErrors(prev => ({ ...prev, fullname: '' }))
        }
    }

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
        if (errors.username) {
            setErrors(prev => ({ ...prev, username: '' }))
        }
    }

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
        <div className='min-h-screen flex items-center justify-center bg-black text-white px-4 py-8'>
            <form onSubmit={handleSignup} className="w-full max-w-md space-y-5">
                {/* Logo */}
                <div className='flex flex-col items-center mb-6'>
                    <Link to="/">
                        <img src={logo} className='cursor-pointer h-16' alt="logo" />
                    </Link>
                    <h2 className='text-2xl font-bold mt-4'>Create Account</h2>
                    <p className='text-gray-400 text-sm mt-2'>Join us today</p>
                </div>

                {/* Fullname Input */}
                <Input 
                    label='Full Name'
                    placeholder='Enter your full name'
                    placeholderText='placeholder:text-gray-500'
                    value={fullname}
                    required
                    onChange={handleFullnameChange}
                    error={errors.fullname}
                    className='rounded'
                />

                {/* Username Input */}
                <Input 
                    label='Username'
                    placeholder='Choose a username'
                    placeholderText='placeholder:text-gray-500'
                    value={username}
                    required
                    onChange={handleUsernameChange}
                    error={errors.username}
                    className='rounded'
                />

                {/* Email Input */}
                <Input 
                    label='Email'
                    type='email'
                    placeholder='Enter your email'
                    placeholderText='placeholder:text-gray-500'
                    value={email}
                    required
                    onChange={handleEmailChange}
                    error={errors.email}
                    className='rounded'
                />

                {/* Password Input */}
                <div>
                    <Input 
                        label='Password'
                        type='password'
                        placeholder='Create a strong password'
                        placeholderText='placeholder:text-gray-500'
                        value={password}
                        required
                        onChange={handlePasswordChange}
                        onFocus={() => setShowPasswordRequirements(true)}
                        error={errors.password}
                        className='rounded'
                    />

                    {/* Password Requirements */}
                    {showPasswordRequirements && password && (
                        <div className='mt-3 p-4 bg-gray-900 border border-gray-700 rounded-lg space-y-2'>
                            <p className='text-sm font-medium text-gray-300 mb-2'>Password Requirements:</p>
                            
                            <div className='space-y-1.5'>
                                <PasswordRequirement 
                                    met={passwordRequirements.minLength}
                                    text="At least 8 characters"
                                />
                                <PasswordRequirement 
                                    met={passwordRequirements.hasUpperCase}
                                    text="One uppercase letter (A-Z)"
                                />
                                <PasswordRequirement 
                                    met={passwordRequirements.hasLowerCase}
                                    text="One lowercase letter (a-z)"
                                />
                                <PasswordRequirement 
                                    met={passwordRequirements.hasNumber}
                                    text="One number (0-9)"
                                />
                                <PasswordRequirement 
                                    met={passwordRequirements.hasSpecialChar}
                                    text="One special character (!@#$%^&*)"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Sign Up Button */}
                <Button 
                    type='submit' 
                    className='w-full bg-[#AE7AFF] hover:bg-[#9c5ff0] transition-colors'
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className='flex items-center justify-center gap-2'>
                            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                            Creating account...
                        </span>
                    ) : (
                        'Sign up'
                    )}
                </Button>

                {/* Sign In Link */}
                <p className='text-center text-gray-400'>
                    Already have an account?{' '}
                    <Link 
                        to="/login" 
                        className='text-purple-400 hover:text-purple-300 font-medium transition-colors'
                    >
                        Sign In
                    </Link>
                </p>
            </form>
        </div>
    )
}

// ✅ Password Requirement Component
interface PasswordRequirementProps {
    met: boolean
    text: string
}

const PasswordRequirement = ({ met, text }: PasswordRequirementProps) => {
    return (
        <div className='flex items-center gap-2 text-sm'>
            {met ? (
                <CheckCircle2 className='w-4 h-4 text-green-500' />
            ) : (
                <XCircle className='w-4 h-4 text-gray-500' />
            )}
            <span className={met ? 'text-green-500' : 'text-gray-400'}>
                {text}
            </span>
        </div>
    )
}

export default Signup