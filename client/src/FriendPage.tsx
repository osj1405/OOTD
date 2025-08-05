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
import FeedView from './component/FeedView';
import useDayFeed from './hooks/useDayFeed';
import useUserFeed from './hooks/useUserFeed';

export default function FriendPage() {
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [friend, setFriend] = useState<User | null>(null)
    const [selectedCard, setSelectedCard] = useState<Feed | null>(null)
    const params = useParams<{id: string}>();
    const friendId = params.id
    const feeds = useDayFeed(friend?.id, selectedDay ? new Date(selectedDay) : null)
    const allFeeds = useUserFeed(friend?.id)
    
    const onSelectDay = (day: any) => {
        setSelectedDay(day)
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const navigate = useNavigate();

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
                        <FriendSideProfile friend_info={friend}/>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.goMainContainer}>
                            <button
                                className={styles.goMainButton}
                                onClick={()=>{
                                    navigate("/main", {state: {refreshFriends: true} })
                                }}>Main</button>
                        </div>
                        <div className={styles.feeds}>
                            <div className={styles.calendars}>
                                <Calendar
                                    selectedDay={selectedDay? selectedDay : undefined}
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
                                                            like_count={feed.like_count}
                                                            onClick={()=>handleCardClick(feed)}></Card>
                                                    )
                                                })}
                                            </CardContainer>
                                        )
                                    })
                                    : <div></div>}
                            </div>
                            <div className={styles.allFeeds}>
                                {
                                    allFeeds.map((feed, index) => {
                                        return(
                                            <>
                                                <FeedView
                                                    key={index}
                                                    id={feed.id}
                                                    user_id={feed.user_id}
                                                    userId={feed.userId}
                                                    profile_image={feed.profile_image}
                                                    thumnail={feed.thumnail}
                                                    images={feed.images}
                                                    content={feed.content}
                                                    created_at={feed.created_at}
                                                    like_count={feed.like_count}
                                                />
                                            </>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {selectedCard && <FeedModal card={selectedCard} onClose={closeCardModal}/>}
            </div>
        </>
    )
}