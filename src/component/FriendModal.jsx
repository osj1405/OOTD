import styles from "./FriendModal.module.css";
import { useNavigate, useParams } from "react-router";

export default function FriendModal ({
    isOpen,
    id,
    profileImage,
}){
    const navigate = useNavigate();
    const param = useParams();

    if(!isOpen)
        return null;
    
    
    return(
        <>
            <div className={styles.container}>
                <div className={styles.infoContainer}>
                    <img 
                        src={profileImage} 
                        alt="friend profile"
                        className={styles.profileImage}/>
                    <p className={styles.id}>{id}</p>
                </div>
                <button 
                    className={styles.followButton}
                    onClick={()=>navigate(`/friendpage/:${param.id}`)}>팔로우</button>
            </div>
        </>
    )
}