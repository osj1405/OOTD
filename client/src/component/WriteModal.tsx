import styles from "./WriteModal.module.css"
import { useState, ChangeEvent } from "react";
import feed_image from '../assets/feed_image.jpg'
import feed_image2 from '../assets/feed_image2.jpg'
import feed_image3 from '../assets/profile_image.jpg'

interface WriteModalProps {
    isOpen: boolean | null;
    onClose: () => void
}
export default function WriteModal({ 
    isOpen, 
    onClose = () => {} 
}:WriteModalProps){
    // eslint-disable-next-line no-unused-vars
    const [image, setImage] = useState<string | null>(null);
    // eslint-disable-next-line no-unused-vars
    const [file, setFile] = useState<File | null>(null); // 서버 전송용
    const images = [feed_image, feed_image2, feed_image3]
    const todayDate = new Date();
    const day = ["일", "월", "화", "수", "목", "금", "토"];
    const todayDay = day[todayDate.getDay()]
    
    const [currentIndex, setCurrentIndex] = useState(0)

    const goNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const goPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    if(!isOpen){
        return null;
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if(selected){
            setImage(URL.createObjectURL(selected));
            setFile(selected);
        }
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.content}>
                    <p className={styles.functionName}>Posting</p>
                    <p>오늘의 스타일을 업로드하세요!</p>
                    <p>{todayDate.getMonth()+1}월 {todayDate.getDate()}일 {todayDay}요일</p>
                    <div className={styles.imagesContainer}>
                        <button 
                            className={styles.carouselButton}
                            onClick={()=>goPrev()}>&lt;</button>
                        <div className={styles.carouselContainer}>
                            {images.map((img, index) => {
                                const isCurrent = index === currentIndex;
                                const isPrev = index === (currentIndex - 1 + images.length) % images.length;
                                const isNext = index === (currentIndex + 1) % images.length;
                                
                                const styleList = [`${styles.image}`]
                                if(isCurrent) styleList.push(`${styles.current}`);
                                else if(isPrev) styleList.push(`${styles.prev}`);
                                else if(isNext) styleList.push(`${styles.next}`);

                                return <img key={index} src={img} className={styleList.join(' ')}/>
                            })}
                            {/* {!file && 
                                <div className={styles.imageArrayContainer}>
                                    <div className={styles.emptyImage}></div>
                                    <div className={styles.emptyImage}></div>
                                </div>} */}
                        </div>
                        <button 
                            className={styles.carouselButton}
                            onClick={()=>goNext()}>&gt;</button>
                    </div>
                    <div className={styles.upload}>
                        {!image && <input type="file" alt="이미지를 등록하세요." accept="image/*/" onChange={handleFileChange}/>}
                        {image && <img src={image} alt="미리보기" style={{width: 400, height: 500}} />}
                    </div>
                     <button
                        className={styles.cancelButton}
                        onClick={onClose}
                    >취소</button>

                </div>
            </div>
        </>
    );
}