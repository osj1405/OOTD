import React from "react";
import styles from './SideProfile.module.css';
import { useNavigate, useParams } from "react-router";

export default function SideProfile(){
    let navigate = useNavigate();
    const params = useParams();

    return (
        <>
            <div className={styles.profile}>
                <div className={styles.profileImage}>
                    profile
                </div>                        
                <p className={styles.id} onClick={()=>{navigate(`/mypage/:${params.id}`)}}>yollkie</p>
                <div className={styles.tagContainer}>
                    <p className={styles.tag}>#lovely</p>
                    <p className={styles.tag}>#Hip</p>
                </div>
                <button className={styles.profileSetButton}>프로필 수정</button>
                <div className={styles.friendsContainer}>
                    <p className={styles.friendsTitle}>Friends</p>
                </div>

            </div>

        </>
    );
}