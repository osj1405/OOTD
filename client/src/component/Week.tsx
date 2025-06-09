import styles from "./Week.module.css"
import { ReactNode } from "react"

interface WeekProps {
    children: ReactNode;
}


export default function Week({children}: WeekProps){
    return (
            <div className={styles.week}>
                {children}
            </div>
        )
}