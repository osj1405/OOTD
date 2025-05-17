import React from "react";
import styles from './SideProfile.module.css';

export default function SideProfile(){
    return (
        <>
            <div className={styles.profile}>
                <div className={styles.profileImage}>
                    profile
                </div>                        
                <p className={styles.id}>yollkie</p>
            </div>
            <div className={styles.tagContainer}>
                <p className={styles.tag}>#lovely</p>
                <p className={styles.tag}>#Hip</p>
            </div>
            <button className={styles.profileSetButton}>프로필 수정</button>
            <div className={styles.friendsContainer}>
                <p className={styles.friendsTitle}>Friends</p>
            </div>
        </>
    );
}