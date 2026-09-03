import { profile } from "../../assets"
import { useState, useEffect, useRef } from 'react'
import { ThumbsUp, ThumbsDown, EllipsisVertical, X, Check } from 'lucide-react'
import { getTimeAgo } from "../../utils/timeAgo"
import { getCommentLikes, toggoleCommentLike } from "../../api/like.api"
import { useToastContext } from "../../context/ToastContext"
import { useAppSelector } from "../../app/hooks"
import { deleteComment, updateComment } from "../../api/comment.api"
import type { RootState } from "../../app/store"
import { useNavigate } from "react-router-dom"

type CommentCardProp = {
    fullname: string
    username: string
    content: string
    createdAt: string
    avatar: string
    commentId?: string
    onDelete?: (commentId: string) => void
    onUpdate?: (commentId: string, newContent: string) => void
}

const CommentCard = ({
    fullname,
    username,
    content,
    createdAt,
    avatar,
    commentId,
    onDelete,
    onUpdate
}: CommentCardProp) => {
  const [reactType, setReactType] = useState('')
  const [likeCount, setLikeCount] = useState(0)
  const [dislikeCount, setDislikeCount] = useState(0)
  const [refreshLikes, setRefreshLikes] = useState(0)
  const [commentContent, setCommentContent] = useState(content)
  const [newContent, setNewContent] = useState(content)
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const toast = useToastContext()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const usernam  = useAppSelector((state: RootState) => state.auth.user?.username)
  const isUser = usernam === username
  const navigate = useNavigate()

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      textareaRef.current.focus()
    }
  }, [isEditing])

  // Toggle to handle comment like
  const handleCommentLike = async (reactionType: string) => {
    if (!commentId) return 
    if (!isAuthenticated) return toast.warning("Please Login/Signup first")
    
    try {
      await toggoleCommentLike(commentId, reactionType)
      setReactType(reactionType)
      setRefreshLikes(prev => prev + 1)
    } catch (error) {
      console.log("Failed to toggle comment reaction:", error)
      toast.error('Failed to toggle comment reaction')
    }
  }

  // Fetch comment likes
  useEffect(() => {
    const fetchCommentLikes = async () => {
      if (!commentId) return 
      try {
        const res = await getCommentLikes(commentId)            
        setLikeCount(res.data?.likesCount)
        setDislikeCount(res.data?.dislikesCount)
        setReactType(res.data?.userReaction)
      } catch (error) {
        console.log("Failed to fetch comment likes:", error)
        toast.error('Failed to fetch comment likes')
      }
    }
    fetchCommentLikes()
  }, [refreshLikes, commentId])

  // Delete comment
  const handleDeleteComment = async () => {
    if (!commentId) return
    
    if (!confirm('Are you sure you want to delete this comment?')) return
    
    try {
      await deleteComment(commentId)
      toast.success('Comment deleted successfully')
      onDelete?.(commentId)
    } catch (error: any) {
      console.log('Failed to delete comment', error)
      toast.error(error?.response?.data?.message || 'Failed to delete comment')
    }
  }
  
  // Update comment
  const handleUpdateComment = async () => {
    if (!commentId) return
    
    const trimmedContent = newContent.trim()
    
    if (!trimmedContent) {
      toast.error('Comment content cannot be empty')
      return
    }
    
    if (trimmedContent === commentContent) {
      setIsEditing(false)
      return
    }
    
    if (trimmedContent.length > 280) {
      toast.error('Comment cannot exceed 280 characters')
      return
    }
    
    setIsUpdating(true)
    
    try {
      await updateComment(commentId, trimmedContent)
      setCommentContent(trimmedContent)
      setIsEditing(false)
      toast.success('Comment updated successfully')
      onUpdate?.(commentId, trimmedContent)
    } catch (error: any) {
      console.log('Failed to update comment', error)
      toast.error(error?.response?.data?.message || 'Failed to update comment')
    } finally {
      setIsUpdating(false)
    }
  }

  // Cancel edit
  const handleCancelEdit = () => {
    setNewContent(commentContent)
    setIsEditing(false)
  }

  // Handle menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  const handleEditClick = () => {
    setIsEditing(true)
    setShowMenu(false)
  }
  
  return (
    <div className="mt-4 z-10">
      <div className="w-full bg-[#EAECF0] h-px"></div>
      <div className="flex mt-3 gap-2 relative z-10">
        {/* Menu */}
        {isUser && isAuthenticated && 
          <div className="absolute right-2 z-50" ref={menuRef}>
          <EllipsisVertical 
            className="cursor-pointer hover:bg-neutral-800 rounded p-1 transition-colors"
            onClick={handleMenuClick} 
          />
          
          {/* Dropdown Menu */}
          {showMenu && (
            <div 
              className="absolute right-7 -mt-6 w-48 z-100 bg-black border border-gray-700 rounded-lg shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()} 
            >
              <button 
                className="w-full text-left px-4 py-3 hover:bg-neutral-900 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  handleEditClick()
                }}
              >
                Edit Comment
              </button>
              <button 
                className="w-full text-left px-4 py-3 z-100 hover:bg-neutral-900 transition-colors text-red-500"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(false)
                  handleDeleteComment()
                }}
              >
                Delete Comment
              </button>
            </div>
          )}
        </div>}

        {/* Comment card details */}
        <div onClick={() => navigate(`/@${username}`)}>
          <img 
            src={avatar || profile} 
            className="h-10 w-10 rounded-full object-cover object-center" 
          />
        </div>

        <div className="text-sm flex-1">
          <div className="flex gap-4 font-semibold">
            <p className="capitalize">{fullname}</p>
            <p className="text-[#5B5B5B]">{getTimeAgo(createdAt)}</p>
          </div>

          {/* Content - Editable */}
          <div className="font-normal mt-1">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  ref={textareaRef}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg p-2 resize-none focus:outline-none focus:border-purple-500"
                  rows={3}
                  maxLength={280}
                  disabled={isUpdating}
                />
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${newContent.length > 280 ? 'text-red-500' : 'text-gray-400'}`}>
                    {newContent.length}/280
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      className="px-3 py-1 text-sm border border-gray-600 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleUpdateComment}
                      disabled={isUpdating || !newContent.trim() || newContent === commentContent}
                      className="px-3 py-1 text-sm bg-[#AE7AFF] rounded hover:bg-[#9758fc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? (
                        'Saving...'
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap wrap-break-word">{commentContent}</p>
            )}
          </div>

          {/* Likes/Dislikes */}
          {!isEditing && (
            <div className="flex gap-5 items-center mt-3">
              <div 
                onClick={() => handleCommentLike('like')}
                className="flex justify-center items-center gap-2 cursor-pointer transition-colors"
              >
                 <ThumbsUp stroke={reactType === 'like' ? '#AE7AFF' : 'white'} />
                <span>{likeCount}</span>
              </div>

              <div 
                onClick={() => handleCommentLike('dislike')}
                className="flex justify-center items-center gap-2 cursor-pointer hover:text-gray-400 transition-colors"
              >
                <ThumbsDown stroke={reactType === 'dislike' ? '#AE7AFF' : 'white'} />
                <span className='text-gray-500'>{dislikeCount}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentCard