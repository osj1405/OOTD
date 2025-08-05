import { useState, useEffect } from "react";
import { Friends } from "../types/Friend";
import axios from "axios";
export default function useGetFollowInfo(user_id: number | undefined){
    const [followings, setFollowings] = useState<Friends []>([])
    const [followers, setFollowers] = useState<Friends []>([])
    const [refreshFlag, setRefreshFlag] = useState(false)

    const refresh = () => {setRefreshFlag(prev => !prev)}

    useEffect(()=>{
        if(user_id){
            getFollowing()
            getFollower()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user_id, refreshFlag])

    async function getFollowing(){
            try {
                const response = await axios.post('/api/friends/get_following', { user_id })
                if(response.status === 200){
                    setFollowings(response.data)
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
                    setFollowers(response.data)
                }
            } catch(error){
                console.log(error)
            }
    }

    return {followings, followers, refresh}
}