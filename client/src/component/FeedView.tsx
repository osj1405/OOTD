import { useEffect, useState } from "react";
import styles from './FeedView.module.css'
import LikeButton from "./LikeButton";
import axios from "axios";

interface FeedProps {
    id: string;
    user_id: string;
    userId?: string;
    profile_image?: string;
    thumnail: string;
    images: string[];
    content?: string;
    created_at: string;
    like_count: number;
}

export default function FeedView({
    id,
    user_id,
    userId,
    profile_image,
    thumnail,
    images,
    content,
    like_count,
    created_at
}: FeedProps){
    const [feedImages, setFeedImages] = useState<string[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [likeCount, setLikeCount] = useState<number>(like_count)
    const [isLiked, setIsLiked] = useState(false)
    const writeDate = new Date(created_at).toDateString()

    useEffect(()=>{
            images.forEach(async (img)=>{
                await getImageUrl(img)
            })
    },[images])
    
    useEffect(()=>{
        console.log(feedImages)
    }, [feedImages])

    useEffect(()=>{
        checkLike()
    }, [])


    function getImageUrl(image: string){
        const fullUrl  = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/feed-images/${user_id}/${id}/${image}`
        setFeedImages(prev=>[...prev, fullUrl])
    }

    function goPrev(){
        setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
    }

    function goNext(){
        setCurrentIndex(prev => (prev + 1) % images.length)
    }


    function clickLike(){
        if(!isLiked){
            setLike()
        } else {
            cancelLike()
        }
    }
    
    
    async function checkLike(){
        try {
            const response = await axios.post('/api/feed/checkLike', { user_id: user_id, feed_id: id})
            if(response.status === 200){
                setIsLiked(response.data.liked)
            }
        } catch(error){
            console.log(error)
        }
    }

    async function setLike(){
        if(isLiked) return;

        try {
            const response = await axios.post('/api/feed/like', {user_id: user_id, feed_id: id})
            if(response.status === 200){
                setLikeCount(likeCount + 1)
                setIsLiked(true)
            }
        } catch(error){
            console.log(error)
        }
    }

    async function cancelLike(){
        if(!isLiked) return;
        
        try {
            const response = await axios.post('/api/feed/unlike', { user_id: user_id, feed_id: id})
            if(response.status === 200){
                setLikeCount(likeCount - 1)
                setIsLiked(false)
            }
        } catch(error){
            console.log(error)
        }
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.carouselContainer}>
                        <button 
                            className={styles.carouselButton}
                            onClick={()=>goPrev()}>&lt;</button>
                        <div className={styles.imagesContainer}>
                            {feedImages.map((img, index)=>{
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
                            <LikeButton isLiked={isLiked} width="20px" height="20px" onClick={clickLike}/>
                            <p>{likeCount}</p>
                        </div>
                        <p className={styles.id}>{userId ? userId : "undefined"}</p>
                        <p className={styles.feedContent}>{content}</p>
                        <p className={styles.time}>{writeDate}</p>
                    </div>
                </div>
             </div>
        </>
    )
}