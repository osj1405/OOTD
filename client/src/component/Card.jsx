import React from "react";
import styles from './Card.module.css';

export default function Card({
    id,
    thumnail,
    time,
    onClick = () => {}
}){
    return(
        <>
            <div 
                className={styles.container}
                onClick={onClick}
                >
                <img className={styles.image} src={thumnail} alt="thumnail"></img>
                <p className={styles.id}>{id}</p>
                <time>{time}</time>
            </div>
        </>
    );
}