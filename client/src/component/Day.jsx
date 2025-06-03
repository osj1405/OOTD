import styles from './Day.module.css';

export default function Day({
    day, 
    year,
    month,
    selected = false,
    sunday = false,
    saturday = false,
    today = false,
    anotherMonth = false,
    onClick = () => {},
}){
    const styleList = [`${styles.day}`]


    if(sunday) styleList.push(`${styles.sunday}`)
    if(saturday) styleList.push(`${styles.saturday}`)
    if(today) styleList.push(`${styles.today}`)
    if(anotherMonth) styleList.push(`${styles.anotherMonth}`)
    if(selected) {
        console.log(`selected!`)
    }

    return (
            <div className={`${styleList.join(' ')}`} onClick={() => {
                if(day instanceof Date) onClick(day)
            }}>
                {day instanceof Date ? <p>{day.getDate()}</p> : <p>{day.toString()}</p>}
                {selected ? <div className={styles.dot} /> : null}
            </div>
        )
}