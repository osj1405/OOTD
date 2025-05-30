import styles from "./Friend.module.css";

export default function Friend({
    id,
    friendProfileImage
}){
    
    return (
        <>
            <div className={styles.container}>
                <img 
                    src={friendProfileImage}
                    alt="friend profile"
                    className={styles.friendImage} />
                <p className={styles.friendsId}>{id}</p>
            </div>
        </>
    )
}