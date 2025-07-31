import axios from "axios"
import { useState, useEffect } from "react"
import { Feed } from "../types/Feed"

export default function useDayFeed(user_id: number | undefined, day: Date | null){
    const [feeds, setFeeds] = useState<Feed []>([])

    useEffect(()=>{
        async function readDayFeed(day: Date){
            try{
                const created_at = new Date(day.setHours(0, 0, 0, 0)).toISOString()
                const created_at_end = new Date(day.setHours(23, 59, 59, 999)).toISOString()
                const response = await axios.post('/api/feed/readDay', { user_id: user_id, created_at: created_at, created_at_end: created_at_end })
                console.log(response.data)
                const sortedFeeds = response.data.slice().sort((prev: Feed, next: Feed) => new Date(next.created_at).getTime() - new Date(prev.created_at).getTime() )
                setFeeds(sortedFeeds)
            } catch(error){
                console.error(error)
            }
        }
        if(day)
            readDayFeed(day)
    })
    return feeds
}