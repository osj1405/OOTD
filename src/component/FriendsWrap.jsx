import styles from './FriendsWrap.module.css';

export default function FriendsWrap({children}){
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}