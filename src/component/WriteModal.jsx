import styles from "./WriteModal.module.css"
import React, { useState } from "react";

export default function WriteModal({ isOpen, onClose }){
    // eslint-disable-next-line no-unused-vars
    const [image, setImage] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [file, setFile] = useState(null); // 서버 전송용


    if(!isOpen){
        return null;
    }
    

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if(selected){
            setImage(URL.createObjectURL(selected));
            setFile(selected);
        }
    }
    return (
        <>
            <div 
                className={styles.container}>
                <div className={styles.content}>
                    <p className={styles.functionName}>Posting</p>
                     <button
                            className={styles.cancelButton}
                            onClick={onClose}
                            >취소</button>
                    <div className={styles.upload}>
                        {!image && <input type="file" alt="이미지를 등록하세요." accept="image/*/" onChange={handleFileChange}/>}
                        {image && <img src={image} alt="미리보기" style={{width: 400, heigth: 500}} />}
                       
                    </div>
                </div>
            </div>
        </>
    );
}