import React from "react";
import Card from "./Card";
import styles from './CardContainer.module.css';

export default function CardContainer(){
    return(
        <>
        <div className={styles.container}> 
            <Card />
            <Card />
            <Card />
            <Card />
        </div>
        </>
    );
}