import { type ToastType, Toast } from "./Toast"
// import { TransitionGroup, CSSTransition } from "react-transition-group"

export interface ToastMessage {
    id: string,
    message: string,
    type: ToastType,
    duration?: number
}

interface ToastContainerProps {
    toasts: ToastMessage[]
    onRemove: (id: string) => void;
}

const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-9999 flex flex-col items-end gap-2 pointer-events-none">
        {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
                <Toast
                    id={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => onRemove(toast.id)}
                />
            </div>
        ))}
    </div>
  )
}

export default ToastContainer