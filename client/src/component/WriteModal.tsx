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

    const onClickeImageUpload = () => {
        if(fileInputRef.current)
            fileInputRef.current.click();
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

            fileArray.forEach(async file =>{
                await uploadImages(file);
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
        
        const imageUrl = urlData.publicUrl

        setImagePreviewUrl(prev => [ ...prev, imageUrl ])
        setUploadImageFilePath(prev => [...prev, filePath])
}
    
    async function uploadFeed(e: any){
        e.preventDefault()
        const supabaseId = supabaseSession?.user.id

        const thumnail = uploadImageFilePath[0]
        
        if(imagePreviewUrl.length === 0){
            alert(`이미지를 입력해 주세요`)
            return;
        }
        try{
            const { data } = await axios.post('/api/feed/upload', {
                supabaseId,
                thumnail,
                uploadImageFilePath,
                content
            });
            console.log(`reponse: ${data}`)
            const feed_id = data.feed.id;
            console.log(`feed_id: ${data.feed.id}`)
            alert('feed upload 성공')

            for(let i = 0; i < uploadImageFilePath.length; i++){
                const filePath = uploadImageFilePath[i]
                console.log(`filePath : ${filePath}`)
                const { data, error } = await supabase.storage.from(`feed-images`).move(`${supabaseId}/temp/${filePath}`,`${supabaseId}/${feed_id}/${filePath}` )
                console.log(data)
                if(error){
                    console.error(error)
                    console.log('fail to move image to feed_id from temp')
                }
                console.log('feed image move to feed from temp')
            }
                
        } catch(uploadErr){
            console.error(uploadErr)           
            removeTempImage()
        }

        setImagePreviewUrl([])
        setUploadImageFilePath([])
        if(fileInputRef.current !== null){
            fileInputRef.current.value = ''
        } 
        onClose()
    }

    const removeTempImage = async() => {
        const supabaseId = supabaseSession?.user.id

        for(let i = 0; i < uploadImageFilePath.length; i++){
            console.log(`storage file path[${i}]: ${uploadImageFilePath[i]}`)
            // fileName.ext 만 있어야 하나보다...
            // 컨벤션 따르기... from 뒤에는 bucket 이름만 둘 것
            const { error } = await supabase.storage.from(`feed-images`).remove([`${supabaseId}/temp/${uploadImageFilePath[i]}`])
            if(error){
                console.log(`temp image remove error: ${error.message}`)
            }
        }
        console.log('image 삭제 완료')
            if(fileInputRef.current !== null){
                fileInputRef.current.value = ''
            }
    }


    const goNext = (imageList: string[]) => {
        setCurrentIndex((prev) => (prev + 1) % imageList.length)
    }

    const goPrev = (imageList: string[]) => {
        setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length)
    }

    const resetForm = () => {
        if(uploadImageFilePath.length > 0){
            removeTempImage()
        }
        setUploadImageFilePath([])
        setImagePreviewUrl([])

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
                                    else if(!isCurrent && !isNext && isPrev) styleList.push(`${styles.prev}`);
                                    else if(!isCurrent && isNext) styleList.push(`${styles.next}`);

                                    return <img key={index}src={img} alt="이미지 미리보기" className={styleList.join(' ')}/>
                                }) :
                                <div>
                                    <div className={`${styles.image} ${styles.current}`}></div>
                                    <div className={`${styles.image} ${styles.prev}`}></div>
                                    <div className={`${styles.image} ${styles.next}`}></div>
                                </div>
                                // : imagesExample.map((img, index) => {
                                // const isCurrent = index === currentIndex;
                                // const isPrev = index === (currentIndex - 1 + imagesExample.length) % imagesExample.length;
                                // const isNext = index === (currentIndex + 1) % imagesExample.length;
                                
                                // const styleList = [`${styles.image}`]
                                // if(isCurrent) styleList.push(`${styles.current}`);
                                // else if(isPrev) styleList.push(`${styles.prev}`);
                                // else if(isNext) styleList.push(`${styles.next}`);

                                // return <img key={index} src={img} className={styleList.join(' ')} alt="임의의 이미지"/>
                            }
                        </div>
                        <button 
                            className={styles.carouselButton}
                            onClick={()=>goNext(imagePreviewUrl.length > 0 ? imagePreviewUrl : imagesExample)}>&gt;</button>
                    </div>
                    <form>
                        <div className={styles.upload}>
                        { imagePreviewUrl.length === 0 
                            &&  <button 
                            type="button"
                            onClick={onClickeImageUpload}
                            className={styles.fileButton}
                            >스타일 불러오기</button>}
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                alt="이미지를 등록하세요." 
                                accept="image/*/" 
                                onChange={handleFileChange}
                                multiple
                                style={{display: "none"}}/>
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
                                onClick={resetForm}
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

