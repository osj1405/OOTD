import styles from "./FeedModal.module.css";
import { useState, useEffect } from "react";
import { Feed } from "../types/Feed";
export default function FeedModal({
    card,
    onClose = () => {}
}:{
    card: Feed,
    onClose: () => void
}){
    const [images, setImages] = useState<string[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)

    const writeDate = new Date(card.created_at).toDateString()

    useEffect(()=>{
        card.images.forEach(async (img)=>{
            await getImageUrl(img)
        })
    }, [card.images])

    function getImageUrl(image: string){
        const fullUrl  = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/feed-images/${card.user_id}/${card.id}/${image}`
        console.log(`image url: ${fullUrl}`)
        setImages(prev=>[...prev, fullUrl])
    }
    
    function goNext(){
        setCurrentIndex(prev => (prev + 1) % images.length)
    }

    function goPrev(){
        setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
    }
    return (
        <>
            <div 
                className={styles.container}>
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
                    {/* <img 
                        src={feedThumnailPath} 
                        alt="style"
                        className={styles.photo}/> */}
                    <div className={styles.information}>
                        <p className={styles.id}>{card.userId}</p>
                        <p className={styles.feedContent}>{card.content}</p>
                        <p className={styles.time}>{writeDate}</p>
                    </div>
                </div>                
            </div>
        </>
    );
}