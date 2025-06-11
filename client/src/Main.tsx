import styles from './Main.module.css';
import { useNavigate } from 'react-router';
import CardContainer from './component/CardContainer';
import Card from './component/Card';
import SideProfile from './component/SideProfile';
import { useState } from 'react';
import WriteModal from './component/WriteModal';
import feedImage from './assets/feed_image.jpg';
import feedImage2 from './assets/feed_image2.jpg';
import FeedModal from './component/FeedModal';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { RootState } from './store/rootStore';
import { createClient } from '@supabase/supabase-js';
import { logout } from './store/authSlice';

function Main(){
    let navigate = useNavigate();
    const supabase = createClient('https://erlobqoenedlpiciifjf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVybG9icW9lbmVkbHBpY2lpZmpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMTI1NTcsImV4cCI6MjA2NDU4ODU1N30.LJ8U8dSpCXDzRwwG1cEHOnIIL63f5IWUoJ46YSE42ac')
    const dispatch = useDispatch();

    // eslint-disable-next-line no-unused-vars
    const [open, setOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [userId, setUserId] = useState('');

    const user = useSelector((state: RootState) => state.auth.user, shallowEqual);

    console.log(user)

    function setOpenModal(){
        setOpen(true);
    }

    function setCloseModal(){
        setOpen(false);
    }

    function handleCardClick(cardData: any){
        setSelectedCard(cardData)
    }

    function closeCardModal(){
        setSelectedCard(null);
    }

    async function handleLogout(){
        const { error } = await supabase.auth.signOut();
        if(error){
            alert(`failed login ${error.message}`)
        } else {
        dispatch(logout())
        }
    }  

    const feedData = [
        {
            id: "pumupcld",
            thumnail: feedImage,
            content: "더현대 다녀왔어용",
            time: "14:02"
        },
        {
            id: "raylist03",
            thumnail: feedImage2,
            content: "데이트~.~",
            time: "14:02"
        },
        {
            id: "yollkie",
            thumnail: feedImage,
            content: "리락쿠마",
            time: "14:02"
        },
        {
            id: "noidraiz",
            thumnail: feedImage2,
            content: "카페 왔당",
            time: "14:02"
        },
        {
            id: "chubuki",
            thumnail: feedImage,
            content: "귀여운 것들 천국!!",
            time: "14:02"
        }
    ]

    const sliceData = [];
    const rows = 4;
    for(let i = 0; i < feedData.length; i += rows){
        sliceData.push(feedData.slice(i, i + rows));
    }

    return(
        <>
        <div className={styles.container}>
            <p className={styles.title}>OOTD</p>
            <div className={styles.contentContainer}>
                <div className={styles.sidebar}>
                    <SideProfile setOpenModal={setOpenModal} idInfo={user?.userId} name={user?.name}/>
                </div>
                <div className={styles.content}>
                    <div className={styles.logoutField}>
                        <button className={styles.logout} onClick={handleLogout}>로그아웃</button>
                    </div>
                    {sliceData.map((row, i) => {
                        return(
                            <CardContainer key={i}>
                                {row.map((feed, i) => {
                                    return (
                                        <Card key={i} id={feed.id} thumnail={feed.thumnail} time={feed.time}
                                            onClick={()=>handleCardClick(feed)}></Card>
                                    )
                                })}
                            </CardContainer>
                        )
                    })}
                </div>
            </div> 
            {selectedCard && <FeedModal card={selectedCard} onClose={closeCardModal}/>}
            <WriteModal isOpen={open} onClose={setCloseModal} />     
        </div>
        </>
    )
}

export default Main;