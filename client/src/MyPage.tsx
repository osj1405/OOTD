import styles from "./MyPage.module.css";
import { useNavigate } from "react-router";
import SideProfile from "./component/SideProfile";
import Calendar from "./component/Calendar";
import { useState } from "react";
import WriteModal from "./component/WriteModal";
import { useSelector } from "react-redux";
import { RootState } from "./store/rootStore";
import axios from "axios";
import { Feed } from "./types/Feed";
import CardContainer from "./component/CardContainer";
import Card from "./component/Card";
import FeedModal from "./component/FeedModal";

export default function MyPage(){
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [feeds, setFeeds] = useState<Feed []>([])
    const [selectedCard, setSelectedCard] = useState<Feed | null>(null);


    const user = useSelector((state: RootState) => state.auth.user)
    
    let navigate = useNavigate();

    const onSelectDay = (day: any) => {
        setSelectedDay(day)
        readDayFeed(selectedDay)
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

    async function readDayFeed(day: Date){
        try{
            const created_at = new Date(day.setHours(0, 0, 0, 0)).toISOString();
            const created_at_end = new Date(day.setHours(23, 59, 59, 999)).toISOString()
            const user_id = user?.id
            const response = await axios.post('/api/feed/readDay', { user_id, created_at, created_at_end })
            console.log(response.data)
            setFeeds(response.data)
        } catch(error){
            console.error(error)
        }
    }

    function handleCardClick(cardData: any){
        setSelectedCard(cardData)
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
                        <Calendar 
                            selectedDay={selectedDay}
                            onSelectDay={onSelectDay}/>
                        {selectedDay 
                        ? <>
                            <div>
                                <CardContainer>
                                {feeds.map((feed, index)=>{
                                    return(
                                        <Card 
                                        key={index}
                                        id={feed.id}
                                        user_id={feed.user_id}
                                        userId={feed.userId}
                                        thumnail={feed.thumnail}
                                        timestamp={feed.created_at}
                                        onClick={()=>handleCardClick(feed)}/>
                                    )
                                })}
                                </CardContainer>
                            </div> 
                        </>
                        : <div></div>}
                    </div>    
                </div>
                {selectedCard && <FeedModal card={selectedCard} onClose={closeCardModal}/>}
                <WriteModal isOpen={open} onClose={setCloseModal}/>
            </div>
        </>
    );
}