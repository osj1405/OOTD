import styles from './Card.module.css';
interface CardProps {
    id: string,
    user_id: string,
    profile_image?: string,
    userId?: string,
    thumnail: string,
    timestamp: number,
    onClick: () => void
}

export default function Card({
    id,
    user_id,
    userId,
    profile_image,
    thumnail,
    timestamp,
    onClick = () => {}
}: CardProps){

    const feedThumnailPath = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/feed-images/${user_id}/${id}/${thumnail}`

    const writeDate = new Date(timestamp).toDateString()

    
    
    return(
        <>
            <div 
                className={styles.container}
                onClick={onClick}
                >
                <img className={styles.image} src={feedThumnailPath} alt="thumnail"></img>
                <div className={styles.profile}>
                   {profile_image && <img src={profile_image} className={styles.profileImage} alt="profile"/>}
                    <p className={styles.id}>{userId}</p>
                </div>
                
                <p className={styles.date}>{writeDate}</p>
            </div>
        </>
    );
}