import { useEffect, useState } from "react";
import { Friends } from "../types/Friend";
import axios from "axios";

export default function useGetFollow(user_id: number | undefined){
    const [followings, setFollowings] = useState<Friends []>([])
    const [followers, setFollowers] = useState<Friends []>([])


    async function getFollowing(){
            try {
                const response = await axios.post('/api/friends/get_following', { user_id })
                if(response.status === 200){
                    setFollowings([...response.data])
                }
            } catch(error){
                console.log(error)
            }
    }

    async function getFollower(){
            try {
                const response = await axios.post('/api/friends/get_follower', { user_id })
                if(response.status === 200){
                    console.log(`followers data - ${response.data}`)
                    setFollowers([...response.data])
                }
            } catch(error){
                console.log(error)
            }
    }

    useEffect(()=>{
        if(user_id){
            getFollowing()
            getFollower()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user_id])

    return {
        followings, 
        followers, 
        refetchFollowings: getFollowing,
        refetchFollowers: getFollower
    }
}