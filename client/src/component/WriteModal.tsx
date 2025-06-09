import styles from "./WriteModal.module.css"
import { useState, ChangeEvent } from "react";

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

    const todayDate = new Date();
    const day = ["일", "월", "화", "수", "목", "금", "토"];
    const todayDay = day[todayDate.getDay()]

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
            <div 
                className={styles.container}
            >
                <div className={styles.content}>
                    <p className={styles.functionName}>Posting</p>
                    <p>오늘의 스타일을 업로드하세요!</p>
                    <p>{todayDate.getMonth()+1}월 {todayDate.getDate()}일 {todayDay}요일</p>
                    <div>
                        {!file && <div className={styles.emptyImage}></div>}
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