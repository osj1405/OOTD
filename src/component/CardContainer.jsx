import React from "react";
import styles from './CardContainer.module.css';

export default function CardContainer({children}){
    return(
        <>
        <div className={styles.container}> 
            {children}
        </div>
        </>
    );
}