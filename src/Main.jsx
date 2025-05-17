import styles from './Main.module.css';
import { useNavigate } from 'react-router';
import CardContainer from './component/CardContainer';

function Main(){
    let navigate = useNavigate();

    return(
        <>
        <div className={styles.container}>
            <p className={styles.title}>OOTD</p>
            <div className={styles.contentContainer}>
                <div className={styles.sidebar}>
                    <div className={styles.profile}>
                        <div className={styles.profileImage}>
                            profile
                        </div>
                        <p className={styles.id}>yollkie</p>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.logoutField}>
                        <button className={styles.logout} onClick={()=>{navigate("/")}}>로그아웃</button>
                    </div>
                    <CardContainer />
                </div>
            </div>        
        </div>
        </>
    )
}

export default Main;