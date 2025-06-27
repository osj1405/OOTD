import styles from "./WriteModal.module.css"
import { useState, useRef, useEffect } from "react";
import feed_image from '../assets/feed_image.jpg'
import feed_image2 from '../assets/feed_image2.jpg'
import feed_image3 from '../assets/profile_image.jpg'
import { useSelector } from "react-redux";
import { RootState } from "../store/rootStore";
import { supabase } from "../App";
import axios from "axios";
import { v4 } from 'uuid'
interface WriteModalProps {
    isOpen: boolean | null;
    onClose: () => void
}
export default function WriteModal({ 
    isOpen, 
    onClose = () => {} 
}:WriteModalProps){
    // eslint-disable-next-line no-unused-vars
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string []>([])
    const [images, setImages] = useState<string[]>([])
    const [uploadImageFilePath, setUploadImageFilePath] = useState<string []>([])
    const [content, setContent] = useState<string>("")

    // eslint-disable-next-line no-unused-vars
    const imagesExample = [feed_image, feed_image2, feed_image3]
    const todayDate = new Date();
    const day = ["일", "월", "화", "수", "목", "금", "토"];
    const todayDay = day[todayDate.getDay()]
    const supabaseSession = useSelector((state: RootState) => state.auth.supabaseSession)
    const [currentIndex, setCurrentIndex] = useState(0)
    
    useEffect(()=>{
        console.log(`previe image array: ${imagePreviewUrl}`)
    
    }, [imagePreviewUrl])

    const fileInputRef = useRef<HTMLInputElement>(null);

    const goNext = (imageList: string[]) => {
        setCurrentIndex((prev) => (prev + 1) % imageList.length)
    }

    const goPrev = (imageList: string[]) => {
        setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length)
    }

    if(!isOpen){
        return null;
    }

    const handleFileChange = (e: any) => {
        const fileList = e.target.files
        

        if(fileList){
            const fileArray = Array.from(fileList)
            if(fileArray.length === 0){
                alert(`이미지를 선택하세요!`)
                return
            }
            if(fileArray.length > 3){
                alert(`이미지는 최대 3장 첨부 가능합니다.`)
                if(fileInputRef.current !== null){
                    fileInputRef.current.value = ''
                }
                return
            }

            fileArray.forEach(file =>{
                uploadImages(file);
            })
        }


    }

 async function uploadImages(file: any){
        if(!file) return;
        const newFileName = v4()
        const fileExt = file.name.split('.').pop()
        const supabaseId = supabaseSession?.user.id
        const filePath = `${supabaseId}-${newFileName}.${fileExt}`

        const { error } = await supabase.storage.from(`feed-images/${supabaseId}`).upload(`/temp/${filePath}`, file, {
          cacheControl: '3600',
          upsert: true  
        })

        if(error){
            alert('프로필 미리보기 업로드 실패')
        }

        console.log(`temp file upload!: ${filePath}`)
        const {data: urlData} = supabase.storage.from(`feed-images/${supabaseId}`).getPublicUrl(`/temp/${filePath}`)
        
        setUploadImageFilePath(prev => [...prev, filePath])
        const imageUrl = urlData.publicUrl
        setImagePreviewUrl(prev => [ ...prev, imageUrl ])
        
}
    
    async function uploadFeed(e: any){
        e.preventDefault()
        const supabaseId = supabaseSession?.user.id

        const thumnail = imagePreviewUrl[0]
        const post_images = new Array(imagePreviewUrl)
        try{
            const { data } = await axios.post('/api/feed/upload', {
                supabaseId,
                thumnail,
                post_images,
                content
            });
            console.log(`reponse: ${data}`)
            const feed_id = data.feed.id;
            console.log(`feed_id: ${data.feed.id}`)
            alert('feed upload 성공')
            for(let i = 0; i < uploadImageFilePath.length; i++){
                const imageUrl = uploadImageFilePath[i]
                console.log(`imageUrl : ${imageUrl}`)
                const { data, error } = await supabase.storage.from(`feed-images`).move(`${supabaseId}/temp/${imageUrl}`,`${supabaseId}/${feed_id}/${imageUrl}` )
                console.log(data)
                if(error){
                    console.error(error)
                }
                console.log('feed image move to feed from temp')
            }
                
        } catch(uploadErr){
            console.error(uploadErr)           
            for(let i = 0; i < imagePreviewUrl.length; i++){
                await supabase.storage.from(`feed-images/${supabaseId}/temp`).remove(images)
                if(fileInputRef.current !== null){
                    fileInputRef.current.value = ''
                }                
                console.log('storage rollback')
            }
        }

        setImages([])
        setImagePreviewUrl([])
        if(fileInputRef.current !== null){
            fileInputRef.current.value = ''
        } 
        onClose()
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
                            onClick={()=>goPrev(imagePreviewUrl.length > 0 ? imagePreviewUrl : imagesExample)}>&lt;</button>
                        <div className={styles.carouselContainer}>
                            {imagePreviewUrl.length > 0 
                                ? imagePreviewUrl.map((img, index)=>{
                                    const isCurrent = index === currentIndex;
                                    const isPrev = index === (currentIndex - 1 + imagePreviewUrl.length) % imagePreviewUrl.length;
                                    const isNext = index === (currentIndex + 1) % imagePreviewUrl.length;
                                
                                    const styleList = [`${styles.image}`]
                                    if(isCurrent) styleList.push(`${styles.current}`);
                                    else if(isPrev) styleList.push(`${styles.prev}`);
                                    else if(isNext) styleList.push(`${styles.next}`);

                                    return <img key={index}src={img} alt="이미지 미리보기" className={styleList.join(' ')}/>
                                })
                                : imagesExample.map((img, index) => {
                                const isCurrent = index === currentIndex;
                                const isPrev = index === (currentIndex - 1 + imagesExample.length) % imagesExample.length;
                                const isNext = index === (currentIndex + 1) % imagesExample.length;
                                
                                const styleList = [`${styles.image}`]
                                if(isCurrent) styleList.push(`${styles.current}`);
                                else if(isPrev) styleList.push(`${styles.prev}`);
                                else if(isNext) styleList.push(`${styles.next}`);

                                return <img key={index} src={img} className={styleList.join(' ')} alt="임의의 이미지"/>
                            })}
                            {/* {!file && 
                                <div className={styles.imageArrayContainer}>
                                    <div className={styles.emptyImage}></div>
                                    <div className={styles.emptyImage}></div>
                                </div>} */}
                        </div>
                        <button 
                            className={styles.carouselButton}
                            onClick={()=>goNext(imagePreviewUrl? imagePreviewUrl : imagesExample)}>&gt;</button>
                    </div>
                    <form>
                        <div className={styles.upload}>
                        { images.length === 0 
                            && <input 
                                type="file" 
                                ref={fileInputRef}
                                alt="이미지를 등록하세요." 
                                accept="image/*/" 
                                onChange={handleFileChange}
                                multiple/>}
                        </div>
                        <input 
                            type="text"
                            multiple
                            className={styles.contentField}
                            placeholder="오늘의 스타일은?"
                            onChange={(e)=>setContent(e.target.value)}
                            />
                        <div className={styles.buttonField}>
                            <button
                                className={styles.cancelButton}
                                onClick={onClose}
                                type="reset"
                            >취소</button>
                            <button
                                className={styles.uploadButton}
                                onClick={uploadFeed}
                                type="submit"
                            >업로드</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

