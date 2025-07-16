import styles from "./Friend.module.css";

export default function Friend({
    id,
    friendProfileImage,
    // onMouseOver = () => {},
    // onMouseOut = () => {}
}:{
    id?: string,
    friendProfileImage?: string,
    // onMouseOver: () => void,
    // onMouseOut: () => void
}){
    
    return (
        <>
            <div 
                className={styles.container}
                // onMouseEnter={onMouseOver}
                // onMouseLeave={onMouseOut}
                >
                <img 
                    src={friendProfileImage}
                    alt="friend profile"
                    className={styles.friendImage} />
                <p className={styles.friendsId}>{id}</p>
            </div>
        </>
    )
}