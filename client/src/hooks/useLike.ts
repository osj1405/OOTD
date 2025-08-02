import axios from "axios"
import { useEffect, useState } from "react"

export default function useLike(user_id: number | undefined, feed_id: number){
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)

    useEffect(()=>{
        checkLike()
        getLikeCount()
    }, [user_id, feed_id])

    async function getLikeCount(){
        try {
            const response = await axios.post('/api/feed/getLike', { feed_id })
            if(response.status === 200){
                console.log(`count: ${response.data}`)
                const count = response.data
                setLikeCount(count)
            }
        } catch(error){
            console.log(error)
        }
    }

    async function checkLike(){
        if(user_id && feed_id){
            try {
                const response = await axios.post('/api/feed/checkLike', { user_id, feed_id})
                if(response.status === 200){
                    setIsLiked(response.data.liked)
                }
            } catch(error){
                console.log(error)
            }
        }
    }

    async function toggleLike(){
        if(!isLiked){
            try {
                const response = await axios.post('/api/feed/like', {user_id: user_id, feed_id})
                if(response.status === 200){
                    getLikeCount()
                    setIsLiked(true)
                }
            } catch(error){
                console.log(error)
            }
        } else {
            try {
            const response = await axios.post('/api/feed/unlike', { user_id: user_id, feed_id})
            if(response.status === 200){
                getLikeCount()
                setIsLiked(false)
            }
            } catch(error){
                console.log(error)
            }
        }
    }

    return {isLiked, likeCount, toggleLike}
}