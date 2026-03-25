import { createTweet, getChannelTweets } from '../../api/tweet.api'
import Button from '../../components/Button'
import TweetCard from '../../components/channel/TweetCard'
import { useState, useEffect } from 'react'
import { useToastContext } from '../../context/ToastContext'
import { useOutletContext } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import type { RootState } from '../../app/store'


type ChannelContext = {
  channelId: number,
  username: string
}

const Tweets = () => {
  const [tweet, setTweet] = useState('')
  const toast = useToastContext()
  const { channelId, username } = useOutletContext<ChannelContext>()
  const [tweets, setTweets] = useState<any[]>([])
  const usernam  = useAppSelector((state: RootState) => state.auth.user?.username)
  const isUser = usernam === username
  
  // method to handle tweet 
  const handleSubmit = async () => {
        
    if (tweet.trim().length === 0) {
      toast.error("Please write something in Tweet")
      return
    }
    try {
      // setLoading(true);
      await createTweet(tweet);
      setTweet(''); 
      toast.success('Tweet created successfully!');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create tweet');
    } finally {
      // setLoading(false); 
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
        e.preventDefault();
        handleSubmit();
    }
  }
// method to fetch tweets
  useEffect(() => {
   const fetchTweets = async () => {
    if (!channelId) return
    try {
      const res = await getChannelTweets(channelId)
      setTweets(res.data.tweets)
    } catch (error) {
      console.log('Failed to fetch tweets', error);
      toast.error('Failed to fetch tweets')
    }
   } 
   fetchTweets()
  }, [channelId, handleSubmit])
  

  return (
    <div className="min-w-[80vw] transition-all duration-500 pb-20">
      {isUser && <div className="flex border h-30 min-w-[80vw] items-end relative">
        <textarea
          value={tweet}
          onKeyDown={handleKeyDown}
          onChange={(e) => setTweet(e.target.value)}
          placeholder="Write a annoucement"
          className="min-w-[80vw] h-full resize-none  text-white p-3  focus:outline-none focus:border-[#AE7AFF] placeholder:text-white"
          rows={4}
        />
        <Button 
          children='Send' 
          className='absolute right-3 bottom-3' 
          onClick={handleSubmit}
        />
      </div>
}
        {tweets && 
            tweets.map((tweet) => (
              <TweetCard 
                key={tweet._id}
                fullname={tweet.owner.fullname}
                username={tweet.owner.username}
                content={tweet.content}
                createdAt={tweet.createdAt}
                avatar={tweet.owner?.avatar}
                tweetId={tweet._id}
              />
            ))
          }
    </div>
  )
}

export default Tweets