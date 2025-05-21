import styles from './Main.module.css';
import { useNavigate } from 'react-router';
import CardContainer from './component/CardContainer';
import SideProfile from './component/SideProfile';
import { useState } from 'react';
import WriteModal from './component/WriteModal';

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

    return(
        <>
        <div className={styles.container}>
            <p className={styles.title}>OOTD</p>
            <div className={styles.contentContainer}>
                <div className={styles.sidebar}>
                    <SideProfile setOpenModal={setOpenModal}/>
                </div>
                <div className={styles.content}>
                    <div className={styles.logoutField}>
                        <button className={styles.logout} onClick={()=>{navigate("/")}}>로그아웃</button>
                    </div>
                    <CardContainer />
                    <CardContainer />
                    <CardContainer />
                    <CardContainer />                    
                </div>
            </div> 
            <WriteModal isOpen={open} onClose={setCloseModal} />     
        </div>
        </>
    )
}

export default Main;