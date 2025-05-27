import React from "react";
import styles from './SideProfile.module.css';
import { useNavigate, useParams } from "react-router";
import myImage from '../assets/profile_image.jpg';

export default function SideProfile(props){
    let navigate = useNavigate();
    const params = useParams();

    function setOpenModal(){
        props.setOpenModal(true);
    }

    return (
        <>
            <div className={styles.profile}>
                <div className={styles.profileImageContainer}>
                    <img src={myImage} alt="profile" className={styles.profileImage}/>
                </div>                        
                <p className={styles.id} onClick={()=>{navigate(`/mypage/:${params.id}`)}}>yollkie</p>
                <div className={styles.tagContainer}>
                    <p className={styles.tag}>#lovely</p>
                    <p className={styles.tag}>#Hip</p>
                </div>
                <button className={styles.profileSetButton}>프로필 수정</button>
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