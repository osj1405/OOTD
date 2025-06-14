import SideProfile from './component/SideProfile'
import styles from './FriendPage.module.css'
import { useParams, useNavigate } from 'react-router'
import { useState, useEffect } from 'react';
import Calendar from './component/Calendar';

export default function FriendPage() {
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [id, setId] = useState("");
    const onSelectDay = (day: any) => {
        setSelectedDay(day)
    }
    const params = useParams<{id?: string}>();
    


    useEffect(() => {
        if(params.id){
        setId(params.id.slice(1, params.id.length));
        }
    }, [params.id])

    const navigate = useNavigate();

    const [name, setName] = useState("friend");

    return (
        <>
            <div className={styles.container}>
                <p className={styles.title}>OOTD</p>
                <div className={styles.contentContainer}>
                    <div className={styles.sidebar}>
                        <SideProfile idInfo={id} name="친구" />
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
                    </div>
                </div>
            </div>
        </>
    )
}