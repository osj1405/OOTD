import styles from "./MyPage.module.css";
import { useNavigate } from "react-router";
import SideProfile from "./component/SideProfile";
import Calendar from "./component/Calendar";
import { useEffect, useState } from "react";
import WriteModal from "./component/WriteModal";
import { useSelector } from "react-redux";
import { RootState } from "./store/rootStore";
import axios from "axios";
import { Feed } from "./types/Feed";
import CardContainer from "./component/CardContainer";
import Card from "./component/Card";
import FeedModal from "./component/FeedModal";
import FeedView from "./component/FeedView";
import useDayFeed from "./hooks/useDayFeed";
import useUserFeed from "./hooks/useUserFeed";

export default function MyPage(){
    const [selectedDay, setSelectedDay] = useState(()=>{return new Date()});
    const [open, setOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<Feed | null>(null);

    const user = useSelector((state: RootState) => state.auth.user)
    
    const feeds = useDayFeed(user?.id, selectedDay)
    const allFeeds = useUserFeed(user?.id)
    let navigate = useNavigate();

    const onSelectDay = (day: any) => {
        setSelectedDay(day)
    }

    function setOpenModal() {
        setOpen(true);
    }

    function setCloseModal(){
        setOpen(false);
    }
    
    function closeCardModal(){
        setSelectedCard(null);
    }


    function handleCardClick(cardData: any){
        setSelectedCard(cardData)
    }

    const sliceData = [];
    const rows = 4;
    for(let i = 0; i < feeds.length; i += rows){
        sliceData.push(feeds.slice(i, i + rows));
    }
    

    return (
        <>
            <div className={styles.container}>
                <p className={styles.title}>OOTD</p>
                <div className={styles.contentContainer}>
                    <div className={styles.sidebar}>
                        <SideProfile setOpenModal={setOpenModal}/>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.goMainContainer}>
                            <button 
                                className={styles.goMainButton}
                                onClick={()=>{
                                navigate("/main")
                            }}>Main</button>
                        </div>
                        <div className={styles.feeds}>
                            <div className={styles.calendars}>
                                <Calendar 
                                    selectedDay={selectedDay}
                                    onSelectDay={onSelectDay}/>
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
                                        console.log(`feeds: ${feed.userId}`)
                                        return (
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
                <WriteModal isOpen={open} onClose={setCloseModal}/>
            </div>
        </>
    );
}