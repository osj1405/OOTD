import styles from "./FeedModal.module.css";

export default function FeedModal({
    card,
    onClose = () => {}
}:{
    card: any,
    onClose: () => void
}){
    return (
        <>
            <div 
                className={styles.container}>
                <div className={styles.content}>
                    <p 
                        className={styles.cancel}
                        onClick={onClose}
                        >X</p>
                    <img 
                        src={card.thumnail} 
                        alt="style"
                        className={styles.photo}/>
                <p className={styles.id}>{card.id}</p>
                <p className={styles.feedContent}>{card.content}</p>
                <p className={styles.time}>{card.time}</p>
                </div>                
            </div>
        </>
    );
}