import axios from "axios"
import { useState, useEffect } from "react"
import { Feed } from "../types/Feed"

export default function useDayFeed(user_id: number | undefined, day: Date | null, refreshKey = 0){
    const [feeds, setFeeds] = useState<Feed []>([])
    const dayTime = day?.getTime()

    useEffect(()=>{
        async function readDayFeed(targetDayTime: number){
            try{
                const startOfDay = new Date(targetDayTime)
                startOfDay.setHours(0, 0, 0, 0)

                const endOfDay = new Date(targetDayTime)
                endOfDay.setHours(23, 59, 59, 999)

                const created_at = startOfDay.toISOString()
                const created_at_end = endOfDay.toISOString()
                const response = await axios.post('/api/feed/readDay', { user_id: user_id, created_at: created_at, created_at_end: created_at_end })
                console.log(response.data)
                const sortedFeeds = response.data.slice().sort((prev: Feed, next: Feed) => new Date(next.created_at).getTime() - new Date(prev.created_at).getTime() )
                setFeeds(sortedFeeds)
            } catch(error){
                console.error(error)
            }
        }
        if(dayTime)
            readDayFeed(dayTime)
    }, [user_id, dayTime, refreshKey])
    return feeds
}
