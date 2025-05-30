import React, { useState } from "react";
import styles from './SideProfile.module.css';
import { useNavigate, useParams } from "react-router";
import myImage from '../assets/profile_image.jpg';

export default function SideProfile({
    setOpenModal = () => {}
}){
    let navigate = useNavigate();
    const params = useParams(); 
    const [id, setId] = useState("pumupcld");
    const [nickname, setNickName] = useState("수진");
    const [profileImage, setProfileImage] = useState(myImage);

    const handleProfileImage = (src) => {
        setProfileImage(src);
    }

    return (
        <>
            <div className={styles.profile}>
                <div className={styles.profileImageContainer}>
                    <img src={profileImage} alt="profile" className={styles.profileImage}/>
                </div>                        
                <p 
                    className={styles.id} 
                    onClick={()=>{navigate(`/mypage/:${params.id}`)}}
                    >{id}</p>
                <p 
                    className={styles.nickname}
                    onClick={() => navigate(`/mypage/:${params.id}`)}>{nickname}</p>
                <div className={styles.tagContainer}>
                    <p className={styles.tag}>#lovely</p>
                    <p className={styles.tag}>#Hip</p>
                </div>
                <button 
                    className={styles.profileSetButton}
                    onClick={()=>{navigate(`/editprofile/:${params.id}`)}}
                    >프로필 수정</button>
                <button 
                    className={styles.writePostButton}
                    onClick={setOpenModal}>포스트하기</button>
                <div className={styles.friendsContainer}>
                    <p>Friends</p>
                </div>
            </div>

        </>
    );
}