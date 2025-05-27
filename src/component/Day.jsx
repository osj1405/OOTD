import styles from './Day.module.css';

export default function Day({
    day, 
    year,
    month,
    disableDay = false,
    sunday = false,
    saturday = false,
    today = false,
    anotherMonth = false,
    onClick = () => {},
}){
    const selector = disableDay || day === 0 ? [] : [`${styles.circlehover}`];
    const styleList = [`${styles.day}`]

    if(sunday) styleList.push(`${styles.sunday}`)
    if(saturday) styleList.push(`${styles.saturday}`)
    if(today) styleList.push(`${styles.today}`)
    if(anotherMonth) styleList.push(`${styles.anotherMonth}`)

    return (
            <div className={`${selector.join(' ')} ${styleList.join(' ')}`} onClick={() => {
                if(day !== 0) onClick(day)
            }}>
                {day instanceof Date ? <p>{day.getDate()}</p> : <p>{day.toString()}</p>}
            </div>
        )
}