import { ReactNode } from 'react';
import styles from './FriendsWrap.module.css';

export default function FriendsWrap({children}:{
    children: ReactNode
}){
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}