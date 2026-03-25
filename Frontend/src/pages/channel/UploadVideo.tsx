import Button from '../../components/Button'
import UIButton from '../../components/UIButton'
import { useState } from 'react';
import ToggleSwitch from '../../components/ToggleSwitch';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import FileDragUpload from '../../components/FileDragUpload';
import { useRef } from 'react';
import { publishVideo } from '../../api/video.api';
import { useToastContext } from '../../context/ToastContext';
import { Loader2 } from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';

const UploadVideo = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Film & Animation');
  const [isPublished, setIsPublished] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>("")
  const username  = useAppSelector((state: RootState) => state.auth.user?.username)
  
  // Upload states
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const toast = useToastContext()
  
  const videoCategory = [
    "Entertainment",
    "Music", //
    "Gaming", //
    "People & Blogs",
    "Comedy",
    "How to & Style",
    "Education", //
    "Science & Technology", //
    "Sports", //
    "Film & Animation" //
  ];

  const handleSave = async () => {
    
    if (!videoFile) {
      toast.error("Please select a video file")
      return false
    }
    
    if (!thumbnail) {
      toast.error("Please select a thumbnail")
      return false
    }
    
    if (!title.trim()) {
      toast.error("Title is required")
      return false
    }

    if (!description.trim()) {
      toast.error("Description is required")
      return false
    }

    if (!category) {
      toast.error("Category is required")
      return false
    }

    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      const payload = {
        videoFile, 
        thumbnail, 
        title: title, 
        description: description, 
        category, 
        isPublished
      }

      await publishVideo(payload, (progress) => {
        setUploadProgress(progress)
      })
      
      toast.success('Video uploaded successfully!')
      navigate('/channel')
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error?.message || 'Failed to upload video')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }
  
  const handleCancel = () => {
    if (isUploading) {
      const confirmCancel = window.confirm('Upload in progress. Are you sure you want to cancel?')
      if (!confirmCancel) return
    }
    navigate(`/@${username}`)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        toast.error('Thumbnail must be less than 5MB')
        return
      }
      
      setThumbnail(file)
      setSelectedFileName(file.name)
    }
  }

  const handleVideoSelect = (file: File | null) => {
    if (file) {
      // Validate video file size (max 100MB)
      const maxSize = 100 * 1024 * 1024 
      if (file.size > maxSize) {
        toast.error('Video must be less than 100MB')
        setVideoFile(null)
        return
      }
    }
    setVideoFile(file)
  }

  // Remove thumbnail
  // const handleRemoveThumbnail = () => {
  //   setThumbnail(null)
  //   setSelectedFileName("")
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = ''
  //   }
  // }

  return (
    <div className="absolute h-full w-full lg:w-[80vw] flex items-center justify-center px-2 lg:px-0 pt-10 top-0">
      <div className="lg:mr-5 bg-black h-[90vh] w-full lg:w-[60vw] border border-white overflow-hidden">
        <div className="flex justify-between items-center px-7 py-3 border-b">
          <p>Upload Videos</p>
          <div className="flex gap-2 lg:gap-5">
            <UIButton 
              children="Cancel" 
              padding='lg:px-4 lg:py-2.5 px-2 py-0' 
              onClick={handleCancel}
              disabled={isUploading}
            />
            <UIButton 
              padding='py-1.5 px-3.5 lg:px-5 lg:py-2.5'
              onClick={handleSave}
              disabled={isUploading}
            >
              {/* Upload button with loader */}
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading... {uploadProgress}%
                </span>
              ) : (
                'Upload'
              )}
            </UIButton>
          </div>
        </div>

        {/* Upload progress bar */}
        {isUploading && (
          <div className="w-full bg-gray-800 h-1">
            <div 
              className="bg-[#AE7AFF] h-1 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <div className="flex flex-col items-center w-full h-[79vh] overflow-y-scroll">              
          <div className="lg:w-3/4">
            <FileDragUpload 
              onFileSelect={handleVideoSelect}
              // disabled={isUploading}
            />
          </div>

          <div className="flex flex-col items-center w-full mb-8">
            <div className="w-3/4 mt-6">
              <label>Thumbnail <span className='text-red-500'>*</span></label>
              <div className="border border-white lg:p-3">
                <div className="flex items-center justify-between gap-3">
                  <Button 
                      children='Choose File'
                      onClick={handleButtonClick}
                      padding='lg:px-5 lg:py-2.5 px-3 py-5'
                      disabled={isUploading}
                    />
                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    
                    {thumbnail ? (
                      <div className="flex items-center gap-3">
                        {/* Thumbnail preview */}
                        <img 
                          src={URL.createObjectURL(thumbnail)} 
                          alt="Thumbnail preview" 
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">
                            {selectedFileName}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {(thumbnail.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No file chosen
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Hidden input */}
              <input 
                type="file"
                accept='image/*'
                ref={fileInputRef}
                className='hidden'
                onChange={handleThumbnailUpload}
                disabled={isUploading}
              />
            </div>

            <div className="flex flex-col gap-6 w-3/4 mt-6">
              <Input 
                label='Title'
                required
                type='text'
                placeholder='Enter Video Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isUploading}
              />
              <div>
                <label className="block text-white mb-2">
                  Description <span className='text-red-500'>*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter video description"
                  className="w-full text-white p-3 border focus:outline-none focus:border-[#AE7AFF] placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={4}
                  disabled={isUploading}
                />
              </div>
            </div>

            <div className="w-3/4 mt-6">
              <label htmlFor="category">
                Choose a category <span className='text-red-500'>*</span>
              </label>
              <br/>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                name="category"
                className='w-full text-white p-3 border outline-none focus:border-[#AE7AFF] focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={isUploading}
              >
                {videoCategory.map((categ) => (
                  <option key={categ} value={categ} className='bg-black'>
                    {categ}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-3/4 mb-8 lg:mb-0 mt-6">
              <ToggleSwitch
                checked={isPublished}
                onChange={setIsPublished}
                label='Publish Status'
                // disabled={isUploading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadVideo