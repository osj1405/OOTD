import styles from './Day.module.css';

export default function Day({day}){
    return (
            <div className={styles.day}>
                {day === 0 ? <p>0</p> : <p>{day}</p> }
            </div>
        )
}