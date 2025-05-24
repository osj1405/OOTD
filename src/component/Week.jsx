import styles from "./Week.module.css"

export default function Week({children}){
    return (
            <div className={styles.week}>
                {children}
            </div>
        )
}