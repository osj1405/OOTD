import styles from "./FriendModal.module.css";
import { useNavigate } from "react-router";

export default function FriendModal ({
    isOpen,
    id,
    profileImage,
    name,
    introduce
}:{
    isOpen: string | null,
    id: string,
    profileImage?: string,
    name?: string,
    introduce?: string
}){
    const navigate = useNavigate();

    if(!isOpen)
        return null;
    
    
    return(
        <>
            <div className={styles.container}>
                <div 
                className={styles.infoContainer}
                onClick={()=>navigate(`/friendpage/${id}`)}>
                    {profileImage ? <img 
                        src={profileImage} 
                        alt="friend profile"
                        className={styles.profileImage}/> : <div className={styles.profileImage}></div>}
                    <div className={styles.rightContainer}>
                        <p className={styles.id}>{id}</p>
                        <p className={styles.name}>{name}</p>
                        <p className={styles.introduce}>{introduce}</p>
                    </div>
                    
                </div>
                <button 
                    className={styles.followButton}
                    >팔로우</button>
            </div>
        </>
    )
}