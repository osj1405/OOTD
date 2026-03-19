import styles from "./FeedModal.module.css";
import { useState, useEffect } from "react";
import { Feed } from "../types/Feed";
import LikeButton from "./LikeButton";
import { useSelector } from "react-redux";
import { RootState } from "../store/rootStore";
import useLike from "../hooks/useLike";
export default function FeedModal({
    card,
    onClose = () => {},
    onDelete,
    showDeleteButton = false,
}:{
    card: Feed,
    onClose: () => void
    onDelete?: (feedId: number) => void
    showDeleteButton?: boolean
}){
    const [images, setImages] = useState<string[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const writeDate = new Date(card.created_at).toDateString()
    const user = useSelector((state: RootState) => state.auth.user)
    const user_id = user?.id
    const {isLiked, likeCount, toggleLike} = useLike(user_id, card.id)
    
    useEffect(()=>{
        const fullUrls = card.images.map((image) => (
            `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/feed-images/${card.user_id}/${card.id}/${image}`
        ))

        setImages(fullUrls)
        setCurrentIndex(0)
    }, [card.id, card.images, card.user_id])
    
    function goNext(){
        setCurrentIndex(prev => (prev + 1) % images.length)
    }

    function goPrev(){
        setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.content}>
                    <p 
                        className={styles.cancel}
                        onClick={onClose}
                        >X</p>
                    <p className={styles.title}>OOTD</p>
                    <div className={styles.carouselContainer}>
                        <button 
                            className={styles.carouselButton}
                            onClick={()=>goPrev()}>&lt;</button>
                        <div className={styles.imagesContainer}>
                            {images.map((img, index)=>{
                                console.log(`image: ${index}`)
                                console.log(`image url: ${img}`)
                                const styleList = [`${styles.image}`]
                                if(index === currentIndex){
                                    styleList.push(`${styles.current}`)
                                } else if(index === (currentIndex + 1) % images.length){
                                    styleList.push(`${styles.next}`)
                                } else if(index === (currentIndex - 1 + images.length) % images.length){
                                    styleList.push(`${styles.prev}`)
                                }

                                return <img src={img} key={index} alt="feed-image" className={styleList.join(' ')}/>
                            })}
                        </div>
                        <button 
                            className={styles.carouselButton}
                            onClick={()=>goNext()}>&gt;</button>
                    </div>
                    <div className={styles.information}>
                        <div className={styles.likeZone}>
                            <LikeButton isLiked={isLiked} width="20px" height="20px" onClick={toggleLike}/>
                            <p>{likeCount}</p>
                            {showDeleteButton && onDelete &&
                                <button
                                    type="button"
                                    className={styles.deleteButton}
                                    onClick={() => onDelete(card.id)}
                                >삭제</button>}
                        </div>
                        <p className={styles.id}>{card.userId}</p>
                        <p className={styles.feedContent}>{card.content}</p>
                        <p className={styles.time}>{writeDate}</p>
                    </div>
                </div>                
            </div>
        </>
    );
}
