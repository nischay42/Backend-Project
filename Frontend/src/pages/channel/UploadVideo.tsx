import { upload } from '../../assets'
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


const UploadVideo = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Film & Animation');
  const [isPublished, setIsPublished] = useState(false);
  const toast = useToastContext()
  const videoCategory = [
  "Entertainment",
  "Music",
  "Gaming",
  "People & Blogs",
  "Comedy",
  "How to & Style",
  "Education",
  "Science & Technology",
  "Sports",
  "Film & Animation"
];
  
  const handleSave = async () => {
    if (!videoFile || ! thumbnail) {
      toast.error("Please select video file and thumbnail")
      return
    }
    
    if (!title) {
      toast.error("Title is required");
      return;
    }

    if (!description) {
      toast.error("Description is required");
      return;
    }

    if (!category) {
      toast.error("Category is required");
      return;
    }
    
    const payload = {videoFile, thumbnail, title, description, category, isPublished}
    await publishVideo(payload)
    toast.success('Video uploaded successfully')
    
    navigate('/channel')
  }
  
  const handleCancel = () => {
    navigate('/channel');
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

   const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setThumbnail(file);
      } else {
        alert('Please upload a image file');
      }
    }
  };

  const handleVideoSelect = (file: File | null) => {
    setVideoFile(file)
  }

  return (
      <div className="absolute h-full w-[80vw] flex items-center justify-center pt-10 top-0">
          <div className="mr-5 bg-black h-[90vh] w-[60vw] border border-white overflow-hidden">
            <div className="flex justify-between items-center px-7 py-3 border-b">
              <p>Upload Videos</p>
              <div className="flex gap-5">
                <UIButton children="Cancle" padding='px-4' onClick={handleCancel} />
                <UIButton children="Save" onClick={handleSave} />
              </div>
            </div>

            <div className="flex flex-col items-center w-full h-[79vh] overflow-y-scroll">              
              <div className="w-3/4">
                <FileDragUpload onFileSelect={handleVideoSelect} />
              </div>

              <div className="flex flex-col items-center w-full mb-8">
                <div className="w-3/4 mt-6">
                <label>Thumbnail*</label>
                  <div className="border border-white flex items-center p-0.5 gap-3">
                    <Button 
                      children='Choose Files'
                      onClick={handleButtonClick}
                    />
                    <input 
                      type="file"
                      accept='image/*'
                      ref={fileInputRef}
                      className='pointer-events-none'
                      onChange={handleThumbnailUpload}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-6 w-3/4 mt-6">
                  <Input 
                    label='Title'
                    required
                    type='text'
                    placeholder='Enter Video Title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <div>
                    <label className="block text-white mb-2">
                      Description*
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter video description"
                      className="w-full  text-white p-3 border focus:outline-none focus:border-[#AE7AFF] placeholder:text-gray-500"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="w-3/4 mt-6">
                  <label htmlFor="category">Choose a category*</label><br/>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    name="category"
                    className='w-full text-white p-3 border outline-none focus:border-[#AE7AFF] focus:ring-0'
                  >
                    {videoCategory.map((categ) => (
                      <option key={categ} value={categ} className='bg-black'>
                        {categ}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-3/4 mt-6">
                  <ToggleSwitch
                    checked={isPublished}
                    onChange={setIsPublished}
                    label='Publish Status'
                  />
                </div>

              </div>
            </div>
          </div>
      </div>

  )
}

export default UploadVideo