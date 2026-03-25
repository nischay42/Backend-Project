import { profile } from "../../assets"
import { useState, useEffect, useRef } from 'react'
import { ThumbsUp, ThumbsDown, EllipsisVertical, X, Check } from 'lucide-react'
import { getTimeAgo } from "../../utils/timeAgo"
import { getTweetLikes, toggoleTweetLike } from "../../api/like.api"
import { useToastContext } from "../../context/ToastContext"
import { useAppSelector } from "../../app/hooks"
import { deleteTweet, updateTweet } from "../../api/tweet.api"
import type { RootState } from "../../app/store"
import { useNavigate } from "react-router-dom"

type TweetCardProp = {
    fullname: string
    username: string
    content: string
    createdAt: string
    avatar: string
    tweetId?: string
    onDelete?: (tweetId: string) => void
    onUpdate?: (tweetId: string, newContent: string) => void
}

const TweetCard = ({
    fullname,
    username,
    content,
    createdAt,
    avatar,
    tweetId,
    onDelete,
    onUpdate
}: TweetCardProp) => {
  const [reactType, setReactType] = useState('')
  const [likeCount, setLikeCount] = useState(0)
  const [dislikeCount, setDislikeCount] = useState(0)
  const [refreshLikes, setRefreshLikes] = useState(0)
  const [tweetContent, setTweetContent] = useState(content)
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

  // Toggle to handle tweet like
  const handleTweetLike = async (reactionType: string) => {
    if (!tweetId) return 
    if (!isAuthenticated) return toast.warning("Please Login/Signup first")
    
    try {
      await toggoleTweetLike(tweetId, reactionType)
      setReactType(reactionType)
      setRefreshLikes(prev => prev + 1)
    } catch (error) {
      console.log("Failed to toggle tweet reaction:", error)
      toast.error('Failed to toggle tweet reaction')
    }
  }

  // Fetch tweet likes
  useEffect(() => {
    const fetchTweetLikes = async () => {
      if (!tweetId) return 
      try {
        const res = await getTweetLikes(tweetId)            
        setLikeCount(res.data?.likesCount)
        setDislikeCount(res.data?.dislikesCount)
        setReactType(res.data?.userReaction)
      } catch (error) {
        console.log("Failed to fetch tweet likes:", error)
        toast.error('Failed to fetch tweet likes')
      }
    }
    fetchTweetLikes()
  }, [refreshLikes, tweetId])

  // Delete tweet
  const handleDeleteTweet = async () => {
    if (!tweetId) return
    
    if (!confirm('Are you sure you want to delete this tweet?')) return
    
    try {
      await deleteTweet(tweetId)
      toast.success('Tweet deleted successfully')
      onDelete?.(tweetId)
    } catch (error: any) {
      console.log('Failed to delete tweet', error)
      toast.error(error?.response?.data?.message || 'Failed to delete tweet')
    }
  }
  
  // Update tweet
  const handleUpdateTweet = async () => {
    if (!tweetId) return
    
    const trimmedContent = newContent.trim()
    
    if (!trimmedContent) {
      toast.error('Tweet content cannot be empty')
      return
    }
    
    if (trimmedContent === tweetContent) {
      setIsEditing(false)
      return
    }
    
    if (trimmedContent.length > 280) {
      toast.error('Tweet cannot exceed 280 characters')
      return
    }
    
    setIsUpdating(true)
    
    try {
      await updateTweet(tweetId, trimmedContent)
      setTweetContent(trimmedContent)
      setIsEditing(false)
      toast.success('Tweet updated successfully')
      onUpdate?.(tweetId, trimmedContent)
    } catch (error: any) {
      console.log('Failed to update tweet', error)
      toast.error(error?.response?.data?.message || 'Failed to update tweet')
    } finally {
      setIsUpdating(false)
    }
  }

  // Cancel edit
  const handleCancelEdit = () => {
    setNewContent(tweetContent)
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
    <div className="mt-4">
      <div className="w-full bg-[#EAECF0] h-px"></div>
      <div className="flex mt-3 gap-2 relative">
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
              className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded-lg shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()} 
            >
              <button 
                className="w-full text-left px-4 py-3 hover:bg-neutral-900 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  handleEditClick()
                }}
              >
                Edit tweet
              </button>
              <button 
                className="w-full text-left px-4 py-3 hover:bg-neutral-900 transition-colors text-red-500"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(false)
                  handleDeleteTweet()
                }}
              >
                Delete tweet
              </button>
            </div>
          )}
        </div>}

        {/* Tweet card details */}
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
                      onClick={handleUpdateTweet}
                      disabled={isUpdating || !newContent.trim() || newContent === tweetContent}
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
              <p className="whitespace-pre-wrap wrap-break-word">{tweetContent}</p>
            )}
          </div>

          {/* Likes/Dislikes */}
          {!isEditing && (
            <div className="flex gap-5 items-center mt-3">
              <div 
                onClick={() => handleTweetLike('like')}
                className="flex justify-center items-center gap-2 cursor-pointer transition-colors"
              >
                 <ThumbsUp stroke={reactType === 'like' ? '#AE7AFF' : 'white'} />
                <span>{likeCount}</span>
              </div>

              <div 
                onClick={() => handleTweetLike('dislike')}
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

export default TweetCard