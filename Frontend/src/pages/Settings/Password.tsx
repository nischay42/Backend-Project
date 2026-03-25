import { useState } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { userPasswordChange } from '../../api/user.api'
import { useToastContext } from '../../context/ToastContext'

const Password = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{
    oldPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToastContext()

  const validateForm = () => {
    const newErrors: any = {}

    if (!oldPassword) {
      newErrors.oldPassword = 'Current password is required'
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    } else if (newPassword === oldPassword) {
      newErrors.newPassword = 'New password must be different'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePasswordChange = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await userPasswordChange({ oldPassword, newPassword, confirmPassword })
      toast.success('Password changed successfully')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setErrors({})
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message
      
      
      if (errorMsg?.toLowerCase().includes('incorrect') || 
          errorMsg?.toLowerCase().includes('invalid')) {
        setErrors({ oldPassword: 'Current password is incorrect' })
      }
      
      toast.error(errorMsg || 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full lg:w-[75vw] p-2 lg:pr-7">
      <h1 className='text-3xl'>Password</h1>
      <p className='text-sm text-gray-400'>Please enter your current password to change your password.</p>
      <div className="h-px my-5 bg-white" />

      <Input 
        type='password' 
        value={oldPassword} 
        onChange={(e) => {
          setOldPassword(e.target.value)
          setErrors(prev => ({ ...prev, oldPassword: undefined }))
        }}
        className='rounded-lg mb-3.5' 
        required 
        label='Current password'
        error={errors.oldPassword}
      />
      
      <Input 
        type='password' 
        value={newPassword} 
        onChange={(e) => {
          setNewPassword(e.target.value)
          setErrors(prev => ({ ...prev, newPassword: undefined }))
        }}
        className='rounded-lg mb-3.5' 
        required 
        label='New password'
        error={errors.newPassword}
      />
      
      <Input 
        type='password' 
        value={confirmPassword} 
        onChange={(e) => {
          setConfirmPassword(e.target.value)
          setErrors(prev => ({ ...prev, confirmPassword: undefined }))
        }}
        className='rounded-lg mb-3.5' 
        required 
        label='Confirm new password'
        error={errors.confirmPassword}
      />

      <div className="h-px mt-5 bg-white" />
      
      <div className="flex w-full gap-5 justify-end py-5">
        <Button 
          onClick={() => {
            setOldPassword('')
            setNewPassword('')
            setConfirmPassword('')
            setErrors({})
          }}
          className='border border-white rounded-lg' 
          textColor='white' 
          bgColor='transparent'
        >
          Cancel
        </Button>
        <Button 
          onClick={handlePasswordChange}
          disabled={isLoading}
          className='rounded-lg'
        >
          {isLoading ? 'Updating...' : 'Update password'}
        </Button>
      </div>
    </div>
  )
}

export default Password