import React from "react";
import styles from './Card.module.css';

export default function Card(){
    return(
        <>
            <div className={styles.container}>
                <div className={styles.image}>사진</div>
                <p className={styles.id}>pumupcld</p>
                <time>14:57</time>
            </div>
        </>
    );
}