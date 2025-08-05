import axios from "axios";
import { useEffect, useState } from "react";

export default function useFollow(user_id: number | undefined, friends_id: number | undefined){
    const [isFollowing, setIsFollowing] = useState(false)
    const [isFollower, setIsFollower] = useState(false)

    useEffect(()=>{
        checkFollower()
        checkFollowing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user_id, friends_id])

    async function checkFollowing(){
        try {
            if(user_id && friends_id){
                const response = await axios.post('/api/friends/check-following', { user_id: user_id, friends_id: friends_id })
                if(response.data.length > 0){
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
            if(user_id && friends_id){
                const response = await axios.post('/api/friends/check-follower', { user_id: user_id, friends_id: friends_id})
                if(response.data.length > 0){
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

    async function toggleFollow(){
        if(!isFollowing){
            try{
                if(user_id && friends_id){
                    const response = await axios.post('/api/friends/', { following_id: friends_id, followed_id: user_id})
                    if(response.status === 200){
                        setIsFollowing(true)
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
                if(user_id && friends_id){
                    const response = await axios.post('/api/friends/unfollow', { followed_id: user_id, following_id: friends_id})
                    if(response.status === 200){
                        setIsFollowing(false)
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
            if(user_id && friends_id){
                const reponse = await axios.post('/api/friends/deleteFollower', { user_id: user_id, follower_id: friends_id})
                if(reponse.status === 200){
                    setIsFollower(false)
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