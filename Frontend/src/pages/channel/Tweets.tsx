import { createTweet } from '../../api/tweet.api'
import Button from '../../components/Button'
import TweetCard from '../../components/channel/TweetCard'
import { useState } from 'react'
import { useToastContext } from '../../context/ToastContext'

const Tweets = () => {
  const [tweet, setTweet] = useState('')
  const toast = useToastContext()

  const handleSubmit = async () => {
        
    if (!tweet) {
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
    if (e.key === 'Enter' && !e.shiftKey) { // Enter without Shift
        e.preventDefault();
        handleSubmit();
    }
  }

  return (
    <div className="w-[80vw] transition-all duration-500">
      <div className="flex border h-30 w-full items-end relative">
        <textarea
          value={tweet}
          onKeyDown={handleKeyDown}
          onChange={(e) => setTweet(e.target.value)}
          placeholder="Write a annoucement"
          className="w-full h-full resize-none  text-white p-3  focus:outline-none focus:border-[#AE7AFF] placeholder:text-white"
          rows={4}
        />
        <Button 
          children='Send' 
          className='absolute right-3 bottom-3' 
          onClick={handleSubmit}
        />
      </div>
      <TweetCard />
      <TweetCard />
      <TweetCard />
      <TweetCard />
    </div>
  )
}

export default Tweets