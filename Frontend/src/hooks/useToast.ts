import { useState, useCallback } from "react";
import { type ToastMessage } from "../components/Toast/ToastContainer";
import { type ToastType } from "../components/Toast/Toast";

const MAX_TOASTS = 6;

export const useToast = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([])

    const showToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
        const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}}`
        const newToast: ToastMessage = { id, message, type, duration }

        setToasts((prev) => {
          const updatedToasts = prev.length >=  MAX_TOASTS
              ? prev.slice(1)
              : prev
          return [...updatedToasts, newToast]
        })
      },[])
    
    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, [])
    
    return {
        toasts,
        showToast,
        removeToast,
        success: (message: string, duration?: number) => showToast(message, 'success', duration),
        error: (message: string, duration?: number) => showToast(message, 'error', duration),
        info: (message: string, duration?: number) => showToast(message, 'info', duration),
        warning: (message: string, duration?: number) => showToast(message, 'warning', duration)
    }
}