import styles from './Main.module.css';
import { useNavigate } from 'react-router';
import CardContainer from './component/CardContainer';
import SideProfile from './component/SideProfile';

function Main(){
    let navigate = useNavigate();

    return(
        <>
        <div className={styles.container}>
            <p className={styles.title}>OOTD</p>
            <div className={styles.contentContainer}>
                <div className={styles.sidebar}>
                    <SideProfile />
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
        </div>
        </>
    )
}

export default Main;