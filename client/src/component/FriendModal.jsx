import styles from "./FriendModal.module.css";
import { useNavigate } from "react-router";

export default function FriendModal ({
    isOpen,
    id,
    profileImage,
}){
    const navigate = useNavigate();

    if(!isOpen)
        return null;
    
    
    return(
        <>
            <div className={styles.container}>
                <div 
                className={styles.infoContainer}
                onClick={()=>navigate(`/friendpage/:${id}`)}>
                    <img 
                        src={profileImage} 
                        alt="friend profile"
                        className={styles.profileImage}/>
                    <p className={styles.id}>{id}</p>
                </div>
                <button 
                    className={styles.followButton}
                    >팔로우</button>
            </div>
        </>
    )
}