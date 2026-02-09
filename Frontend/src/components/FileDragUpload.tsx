import { useState, type DragEvent } from 'react';
import { upload } from '../assets';
import { useRef } from 'react';
import UIButton from './UIButton';
import { useToastContext } from '../context/ToastContext';

interface FileDragUploadProps {
  onFileSelect: (file: File | null) => void;
} 

const FileDragUpload = ({ onFileSelect }: FileDragUploadProps) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToastContext()

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = e.target.files[0];
      if (files.type.startsWith('video/')) {
        setVideoFile(files);
        onFileSelect(files);
      } else {
        toast.error('Please upload a video file', 2000)
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      // Check if it's a video file
      if (files[0].type.startsWith('video/')) {
        setVideoFile(files[0]);
      } else {
        toast.error('Please upload a video file', 2000);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div 
      className={`
        border-2 border-dashed pb-6 w-full mt-4 flex flex-col items-center
        transition-colors duration-200
        ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="bg-[#101014] mt-5 h-36 w-36 flex items-center justify-center rounded-full">
        <div className="bg-[#E4D3FF] h-28 w-28 flex items-center justify-center rounded-full">
          <img src={upload} className='h-15' alt="upload icon" />
        </div>
      </div>
      
      <div className="mt-3 flex flex-col justify-center items-center gap-2">
        {videoFile ? (
          <div className="text-center">
            <p className="text-green-500">✓ Video selected</p>
            <p className="text-sm text-gray-400">{videoFile.name}</p>
          </div>
        ) : (
          <>
            <p>Drag and drop video files to upload</p>
            <p className="text-gray-400 text-sm">Your videos will be private until you publish them</p>
          </>
        )}
        
        <input 
          ref={fileInputRef}
          type="file"
          accept='video/*'
          onChange={handleVideoUpload}
          style={{ display: 'none' }}
          id="video-upload"
        />
          <UIButton 
            children='Select Files' 
            className='mt-2' 
            onClick={handleButtonClick}
          />
      </div>
    </div>
  );
};

export default FileDragUpload;