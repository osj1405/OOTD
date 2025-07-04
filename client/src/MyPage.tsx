import styles from "./MyPage.module.css";
import { useNavigate } from "react-router";
import SideProfile from "./component/SideProfile";
import Calendar from "./component/Calendar";
import { useState } from "react";
import WriteModal from "./component/WriteModal";
import { useSelector } from "react-redux";
import { RootState } from "./store/rootStore";

export default function MyPage(){
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [open, setOpen] = useState(false);
    
    const user = useSelector((state: RootState) => state.auth.user)
    
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
                    </div>    
                </div>
                <WriteModal isOpen={open} onClose={setCloseModal}/>
            </div>
        </>
    );
}