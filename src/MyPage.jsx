import React from "react";
import styles from "./MyPage.module.css";
import { useNavigate } from "react-router";
import SideProfile from "./component/SideProfile";
import Calendar from "./component/Calendar";
import { useState } from "react";

export default function MyPage(){
    const [selectedDay, setSelectedDay] = useState(new Date());
    let navigate = useNavigate();

    const onSelectDay = (day) => {
        setSelectedDay(day)
    }

    return (
        <>
            <div className={styles.container}>
                <p className={styles.title}>OOTD</p>
                <div className={styles.contentContainer}>
                    <div className={styles.sidebar}>
                        <SideProfile />
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
                    </div>
                    
                </div>
            </div>
        </>
    );
}