import React from "react";
import styles from './Card.module.css';

export default function Card({
    id,
    thumnail,
    time
}){
    return(
        <>
            <div 
                className={styles.container}
                >
                <img className={styles.image} src={thumnail} alt="thumnail"></img>
                <p className={styles.id}>{id}</p>
                <time>{time}</time>
            </div>
        </>
    );
}