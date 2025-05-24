import React from "react";
import styles from "./MyPage.module.css";
import { useNavigate } from "react-router";
import SideProfile from "./component/SideProfile";
import Calendar from "./component/Calendar";

export default function MyPage(){
    let navigate = useNavigate();

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
                        <Calendar />
                    </div>
                </div>
            </div>
        </>
    );
}