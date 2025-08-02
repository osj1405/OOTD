import axios from "axios"
import { useEffect, useState } from "react"

export default function useFollow(user_id: number | undefined, friend_id: number | undefined, refetchFollowings?: () => void, refetchFollowers?: () => void){
    const [isFollowing, setIsFollowing] = useState(false)
    const [isFollower, setIsFollower] = useState(false)

    useEffect(()=>{
        async function checkFollowing(){
        try {
            if(user_id && friend_id){
                const response = await axios.post('/api/friends/check-following', { user_id: user_id, friends_id: friend_id })
                if(response.data.length > 0 && !isFollowing){
                    setIsFollowing(true)
                    }
            } else {
                setIsFollowing(false)
                return
            }
        } catch(error){
            console.log(error)
        }
    }

    async function checkFollower(){
        try {
            if(user_id && friend_id){
                const response = await axios.post('/api/friends/check-follower', { user_id, friends_id: friend_id})
                if(response.status === 200){
                    setIsFollower(true)
                } else {
                    setIsFollower(false)
                    return
                }
            }
        } catch(error){
            console.log(error)
        }
    }

    if(user_id){
        checkFollowing()
        checkFollower()    
    }
    }, [user_id])

    async function toggleFollow(){
        if(!isFollowing){
            try{
                if(friend_id && user_id){
                    const response = await axios.post('/api/friends/', { following_id: friend_id, followed_id: user_id})
                    if(response.status === 200){
                        setIsFollowing(true)
                        refetchFollowings?.(); // 🔄 팔로우 목록 다시 가져오기
                    }
                } else {
                    console.log('user information undefined')
                    return
                }
            } catch(error){
                console.log(error)
            }
        } else {
            try {
                if(friend_id && user_id){
                    const response = await axios.post('/api/friends/unfollow', { user_id, following_id: friend_id})
                    if(response.status === 200){
                        setIsFollowing(false)
                        refetchFollowers?.();
                    } else {
                        console.log('user information undefined')
                        return
                    }
                }
            } catch(error){
                console.log(error)
            }
        }

    }

    async function deleteFollower(){
        if(!isFollower) return
        try {
            if(friend_id && user_id){
                const reponse = await axios.post('/api/friends/deleteFollower', { user_id, follower_id: friend_id})
                if(reponse.status === 200){
                    setIsFollower(false)
                    refetchFollowers?.();
                } else {
                    console.log('something wrong')
                    return
                }
            }
        } catch(error){
            console.log(error)
        }

    }
    return {isFollowing, isFollower, toggleFollow, deleteFollower}
}