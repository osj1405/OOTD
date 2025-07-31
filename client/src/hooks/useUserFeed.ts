import { useEffect, useState } from "react";
import { Feed } from "../types/Feed";
import axios from "axios";

export default function useUserFeed(user_id: number | undefined){
    const [feeds, setFeeds] = useState<Feed[]>([])

    useEffect(()=>{
        async function readUserFeed(){
            try {
                const response = await axios.post('/api/feed/readMyFeed', { user_id })
                if(response.status === 200){
                    const sortedFeeds = response.data.slice().sort((prev: Feed, next: Feed) => new Date(next.created_at).getTime() - new Date(prev.created_at).getTime())
                    setFeeds(sortedFeeds)
                }
            } catch(error){
                console.log(error)
            }
        }
        readUserFeed()
    })

    return feeds
}