import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type  ToastType =  'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string
    type?: ToastType
    duration?: number
    onClose: () => void
    id: string
}

export const Toast = ({
    message,
    type ='info',
    duration = 4000,
    onClose,
    id
}: ToastProps) => {
    const [isVisible, setIsVisible] = useState(false)
    const [isLeaving, setIsLeaving] = useState(false)

    useEffect(() => {
        // slide in
      const slideInTimer = setTimeout(() => setIsVisible(true), 10)
    
    //   auto hide after duration
      const hidetimer = setTimeout(() => {
        setIsLeaving(true)
        setTimeout(() => {
            onClose()
        }, 300)
      }, duration);

      return () => {
        clearTimeout(slideInTimer)
        clearTimeout(hidetimer)
      }
    }, [id])
    
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-400" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
            case 'info':
            default:
                return <Info className="w-5 h-5 text-blue-400" />;
        }
    }

    const getBackgroundColor = () =>{
        switch (type) {
            case 'success':
                return 'bg-gray-800 border-green-500';
            case 'error':
                return 'bg-gray-800 border-red-500';
            case 'warning':
                return 'bg-gray-800 border-yellow-500';
            case 'info':
            default:
                return 'bg-gray-800 border-blue-500';
        }
    }

  return (
    <div 
    className={`min-w-75 max-w-100
        ${getBackgroundColor()} border-l-4 rounded-lg shadow-lg
        p-4 transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-[calc(100%+2rem)] opacity-0'}
        `}
    >
        <div className="flex items-start gap-3">
            <div className="flex shrink-0 mt-0.5">
                {getIcon()}
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-white">{message}</p>
            </div>
        </div>
    </div>
  )
}
