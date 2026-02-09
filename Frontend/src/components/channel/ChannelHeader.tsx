import { plus, follow } from '../../assets'
import ChannelTabs from './ChannelTabs'
import { profile } from '../../assets'
import UIButton from '../UIButton'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import type { RootState } from "../../app/store.ts"

interface ChannelPayload {
  avatar: string
  coverImage: string
  fullname: string
  username: string
  subscribers: number
  subscribed: number
  isSubscribed: boolean
}

interface Props {
  details: ChannelPayload
}

const ChannelHeader = ({ details }: Props) => {

  const username  = useAppSelector((state: RootState) => state.auth.user?.username)

  const isUser = username === details.username

  return (
    <div className='h-auto w-full overflow-auto'>
        <div className="w-full h-40">
          <img src={details.coverImage} alt="" className='w-full h-full' />
        </div>
        <div className="w-[80vw] ml-6">
            <div className="w-full h-[9vw] flex justify-between items-center">
             <div className="flex">
               <div className="h-[10vw] w-[10vw] bg-transparent  rounded-full ml-7 -mt-4">
                <img src={profile} srcSet={details.avatar} className='h-[10vw] w-[10vw] rounded-full bg-center bg-transparent' />
               </div>
               <div className="ml-2">
                <div className="mt-10">
                 <h1 className='text-3xl font-semibold capitalize'>{details.fullname}</h1>
                 <h2 className='font-normal text-sm lowercase'>@{details.username}</h2>
                 <div className="flex font-normal gap-2 text-sm">
                   <h2>{details.subscribers} Subscribers </h2>
                   <p>•</p>
                   <h2>{details.subscribed} Subscribed</h2>
                 </div>
                </div>
               </div>
             </div>
             <div className="flex">
              {isUser 
              ? <Link to="upload" >
                  <UIButton 
                    children='Create' icon={plus} 
                    className='gap-2 mr-4' padding='px-4 py-2.5' 
                    imgClass='h-5 w-5' 
                  />
                </Link> 
              : (details.isSubscribed
                ? <UIButton children='Subscribed' className='bg-white' />
                : <UIButton children='Subscribe' className='gap-2' icon={follow}  />
                )
              }
               
              
              
             </div>
            </div>
            <div className="flex  h-12 ">
              <ChannelTabs />
            </div>
            <div className=" h-0.5 mt-5  bg-white"></div>
        </div>
    </div>
  )
}

export default ChannelHeader