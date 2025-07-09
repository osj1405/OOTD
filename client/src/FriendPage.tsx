import styles from './FriendPage.module.css'
import { useParams, useNavigate } from 'react-router'
import { useState, useEffect } from 'react';
import Calendar from './component/Calendar';
import axios from 'axios';
import { User } from './types/User';
import FriendSideProfile from './component/FriendSideProfile';
import { Feed } from './types/Feed';
import CardContainer from './component/CardContainer';
import Card from './component/Card';
import FeedModal from './component/FeedModal';

export default function FriendPage() {
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [feeds, setFeeds] = useState<Feed []>([])
    const [friend, setFriend] = useState<User | null>(null)
    const [selectedCard, setSelectedCard] = useState<Feed | null>(null)

    const params = useParams<{id: string}>();
    const friendId = params.id

    
    const onSelectDay = (day: any) => {
        setSelectedDay(day)
    }

    useEffect(()=>{
        readDayFeed(new Date(selectedDay))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDay])

    useEffect(()=>{
        async function getFriendProfile(){
            try{
                const response = await axios.post('/api/users/getFriendProfile', { userId: friendId })
                if(response.status === 200){
                    const data = response.data
                    console.log(`response: ${data}`)
                    setFriend(data)
                }
            } catch(error){
                setFriend(null)
                console.error(error)
                alert(`not found friend`)
            }
        }

        getFriendProfile()
        console.log(`get friend profile: ${friend}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const navigate = useNavigate();

   
    async function readDayFeed(day: Date){
        try{
            const created_at = new Date(day.setHours(0, 0, 0, 0)).toISOString();
            const created_at_end = new Date(day.setHours(23, 59, 59, 999)).toISOString()
            const user_id = friend?.id
            const response = await axios.post('/api/feed/readDay', { user_id, created_at, created_at_end })
            console.log(response.data)
            const sortedFeeds = response.data.slice().sort((prev: Feed, next: Feed) => new Date(next.created_at).getTime() - new Date(prev.created_at).getTime() )
            setFeeds(sortedFeeds)
        } catch(error){
            console.error(error)
        }
    }

    function handleCardClick(cardData: any){
        setSelectedCard(cardData)
    }

    function closeCardModal(){
        setSelectedCard(null);
    }

    const sliceData = []
    const rows= 4

    for(let i = 0; i < feeds.length; i += rows){
        sliceData.push(feeds.slice(i, i + rows))
    }

    return (
        <>
            <div className={styles.container}>
                <p className={styles.title}>OOTD</p>
                <div className={styles.contentContainer}>
                    <div className={styles.sidebar}>
                        <FriendSideProfile user={friend}/>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.goMainContainer}>
                            <button
                                className={styles.goMainButton}
                                onClick={()=>{
                                    navigate("/main")
                                }}>Main</button>
                        </div>
                        <Calendar
                            selectedDay={selectedDay}
                            onSelectDay={onSelectDay} />
                        {selectedDay && sliceData.length > 0
                            ? sliceData.map((row, i) => {
                                return (
                                    <CardContainer key={i}>
                                        {row.map((feed, index) =>{
                                            return (
                                                <Card 
                                                    key={index} 
                                                    id={feed.id}
                                                    user_id={feed.user_id}
                                                    userId={feed.userId}
                                                    thumnail={feed.thumnail}
                                                    timestamp={feed.created_at}
                                                    onClick={()=>handleCardClick(feed)}></Card>
                                            )
                                        })}
                                    </CardContainer>
                                )
                            })
                            : <div></div>}
                    </div>
                </div>
                {selectedCard && <FeedModal card={selectedCard} onClose={closeCardModal}/>}
            </div>
        </>
    )
}