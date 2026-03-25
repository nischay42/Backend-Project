import { useEffect, useState, useRef } from 'react'
import { profile } from '../../assets'
import { currentUser, updateAccountDetails, updateAvatar, updateCoverImage } from '../../api/user.api'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { useToastContext } from '../../context/ToastContext'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Input'
import { CloudUpload, Loader2 } from 'lucide-react'
import { fetchCurrentUser } from '../../features/auth/authSlice'

interface User {
  avatar: string
  coverImage: string
  createdAt: string
  email: string
  fullname: string
  username: string
}

const MyDetails = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [user, setUser] = useState<User | null>(null)
  const toast = useToastContext()
  const navigate = useNavigate()
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState<string>()
  const [coverImage, setCoverImage] = useState<string>()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverImageInputRef = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isAuthenticated) return
    const fetchUser = async () => {
      try {
        const res = await currentUser()
        setUser(res.data?.user)
      } catch (error) {
        console.error('Current user not fetched', error)
        toast.error('Failed to load user data')
      }
    }
    fetchUser()
  }, [isAuthenticated])

  useEffect(() => {
    if (user) {
      setFullname(user.fullname)
      setUsername(user.username)
      setEmail(user.email)
      setAvatar(user.avatar)
      setCoverImage(user.coverImage)
    }
  }, [user])

  const handleAccountDetails = async () => {
    setIsUpdating(true)
    try {
      await updateAccountDetails({ fullname, email, username })
      toast.success('Account details updated successfully')
      dispatch(fetchCurrentUser())
    } catch (error: any) {
      console.error('Account update error:', error)
      const errorMsg = error?.response?.data?.message || 'Failed to update account details'
      toast.error(errorMsg)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      
      setAvatarFile(file)
      
      // Preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatar(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      
      // Validate file size (e.g., max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB')
        return
      }
      
      setCoverImageFile(file)
      
      // Preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setCoverImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarInput = () => {
    avatarInputRef.current?.click()
  }

  const handleCoverImgInput = () => {
    coverImageInputRef.current?.click()
  }

  const handleAvatarAndCoverImgUpdate = async () => {
    setIsUploading(true)
    try {
      // Upload avatar
      if (avatarFile) {
        await updateAvatar(avatarFile)
        toast.success('Avatar updated successfully')
        setAvatarFile(null) // Clear file after upload
      }
      
      // Upload cover image
      if (coverImageFile) {
        await updateCoverImage(coverImageFile)
        toast.success('Cover image updated successfully')
        setCoverImageFile(null) // Clear file after upload
      }
      
      // Refresh user data
      const res = await currentUser()
      setUser(res.data?.user)
      dispatch(fetchCurrentUser())
    } catch (error: any) {
      console.error('Image upload error:', error)
      
      // Parse error message
      let errorMsg = 'Failed to update images'
      if (error?.response?.data?.message) {
        errorMsg = error.response.data.message
      } else if (typeof error?.response?.data === 'string') {
        // Handle HTML error
        const match = error.response.data.match(/<pre>(.*?)<br>/i)
        if (match && match[1]) {
          errorMsg = match[1].replace(/^Error:\s*/i, '').trim()
        }
      }
      
      toast.error(errorMsg)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    // Reset to original values
    if (user) {
      setFullname(user.fullname)
      setUsername(user.username)
      setEmail(user.email)
      setAvatar(user.avatar)
      setCoverImage(user.coverImage)
      setAvatarFile(null)
      setCoverImageFile(null)
    }
  }

  return (
    <div className='h-auto w-full lg:max-w-[75vw] overflow-auto'>
      {/* Cover Image */}
      <div className="w-full h-25 lg:h-40 relative group">
        <img 
          src={coverImage} 
          alt="Cover" 
          className='w-full h-full object-cover object-center' 
        />
        <div 
          onClick={handleCoverImgInput} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 lg:p-3 cursor-pointer bg-white/60 backdrop-blur-sm hover:bg-white/80 border border-black/20 rounded-lg transition-all"
        >
          <CloudUpload className='text-black w-5 h-5 lg:w-6 lg:h-6' />
          <input 
            ref={coverImageInputRef}
            type="file"
            accept='image/*'
            onChange={handleCoverImage}
            className="hidden"
            disabled={isUploading}
          />
        </div>
        {coverImageFile && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            New cover selected
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="lg:max-w-[75vw] relative">
        <div className="min-w-[75vw] h-[7vw] flex justify-between">
          <div className="lg:flex">
            {/* Avatar */}
            <div className="flex relative items-center justify-center h-25 w-25 lg:h-[10vw] lg:w-[10vw] bg-black rounded-full ml-7 -mt-10 z-50">
              <img 
                src={avatar || profile} 
                alt="Avatar"
                className='h-25 w-25 lg:h-[10vw] lg:w-[10vw] rounded-full border-4 border-black object-cover object-center' 
              />
              <div 
                onClick={handleAvatarInput} 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5 cursor-pointer bg-white/60 backdrop-blur-sm hover:bg-white/80 border border-black/20 rounded-lg transition-all"
              >
                <CloudUpload className='text-black w-5 h-5' />
                <input 
                  ref={avatarInputRef}
                  type="file"
                  accept='image/*'
                  onChange={handleAvatar}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
              {avatarFile && (
                <div className="absolute -bottom-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  New
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="ml-2">
              <div className="mt-2">
                <h1 className='text-3xl font-semibold capitalize'>{user?.fullname}</h1>
                <h2 className='font-normal text-sm lowercase'>@{user?.username}</h2>
              </div>
            </div>
          </div>

          {/* View Profile Button */}
          <div className="mr-2 lg:mr-7 mt-5">
            <Button 
              onClick={() => navigate(`/@${user?.username}`)}
            >
              View profile
            </Button>
          </div>
        </div>

        {/* Save/Cancel for Images */}
        {(avatarFile || coverImageFile) && (
          <div className="flex w-full gap-3 lg:gap-5 justify-end lg:pr-7 lg:py-3 absolute lg:static top-30 right-2">
            <Button 
              onClick={handleCancel}
              disabled={isUploading}
              className='border border-white lg:rounded-lg'
              padding='px-2 py-1 lg:px-5 lg:py-2.5' 
              textColor='white' 
              bgColor='transparent'
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAvatarAndCoverImgUpdate}
              disabled={isUploading}
              className='lg:rounded-lg'
              padding='px-2 py-1'
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </span>
              ) : (
                'Save changes'
              )}
            </Button>
          </div>
        )}

        <div className="lg:h-0.5 mt-5 mx-7 bg-gray-700" />
      </div>

      {/* Personal Info */}
      <div className="lg:flex lg:p-7 mt-30 lg:mt-0 px-2">
        <div className="mr-10 w-64">
          <h1 className="text-lg font-semibold">Personal info</h1>
          <p className='text-sm mb-7 text-gray-400'>Update your photo and personal details.</p>
        </div>

        <div className="border border-gray-700 rounded-lg w-full mb-30 lg:mb-0">
          <div className="flex w-full gap-8 px-5 pt-5">
            <Input 
              label='Full name' 
              value={fullname} 
              onChange={(e) => setFullname(e.target.value)} 
              className='rounded-lg'
              disabled={isUpdating}
            />
            <Input 
              label='Username' 
              value={username} 
              className='rounded-lg' 
              onChange={(e) => setUsername(e.target.value)}
              disabled={isUpdating}
            />
          </div>
          <div className="px-5 pt-5">
            <Input 
              type='email' 
              label='Email address' 
              value={email} 
              className='rounded-lg' 
              onChange={(e) => setEmail(e.target.value)}
              disabled={isUpdating}
            />
          </div>

          <div className="h-px w-full bg-gray-700 mt-8" />
          
          <div className="flex w-full gap-5 justify-end p-5">
            <Button 
              onClick={handleCancel}
              disabled={isUpdating}
              className='border border-white rounded-lg' 
              textColor='white' 
              bgColor='transparent'
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAccountDetails}
              disabled={isUpdating}
              className='rounded-lg'
            >
              {isUpdating ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyDetails