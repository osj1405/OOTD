import styles from './Main.module.css';
import { useNavigate } from 'react-router';
import CardContainer from './component/CardContainer';
import Card from './component/Card';
import SideProfile from './component/SideProfile';
import { useState } from 'react';
import WriteModal from './component/WriteModal';
import feedImage from './assets/feed_image.jpg';
import feedImage2 from './assets/feed_image2.jpg';

function Main(){
    let navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [open, setOpen] = useState(false);

    function setOpenModal(){
        setOpen(true);
    }

    function setCloseModal(){
        setOpen(false);
    }

    const feedData = [
        {
            id: "pumupcld",
            thumnail: feedImage,
            time: "14:02"
        },
        {
            id: "raylist03",
            thumnail: feedImage2,
            time: "14:02"
        },
        {
            id: "yollkie",
            thumnail: feedImage,
            time: "14:02"
        },
        {
            id: "noidraiz",
            thumnail: feedImage2,
            time: "14:02"
        },
        {
            id: "chubuki",
            thumnail: feedImage,
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
                    <SideProfile setOpenModal={setOpenModal} idInfo="pumupcld" />
                </div>
                <div className={styles.content}>
                    <div className={styles.logoutField}>
                        <button className={styles.logout} onClick={()=>{navigate("/")}}>로그아웃</button>
                    </div>
                    {sliceData.map((row, i) => {
                        return(
                            <CardContainer key={i}>
                                {row.map((feed, i) => {
                                    return (
                                        <Card key={i} id={feed.id} thumnail={feed.thumnail} time={feed.time}></Card>
                                    )
                                })}
                            </CardContainer>
                        )
                    })}
                </div>
            </div> 

            <WriteModal isOpen={open} onClose={setCloseModal} />     
        </div>
        </>
    )
}

export default Main;