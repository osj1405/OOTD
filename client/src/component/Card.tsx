import React from "react";
import styles from './Card.module.css';

interface CardProps {
    id: string,
    thumnail: string,
    time: string,
    onClick: () => void
}

export default function Card({
    id,
    thumnail,
    time,
    onClick = () => {}
}: CardProps){
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