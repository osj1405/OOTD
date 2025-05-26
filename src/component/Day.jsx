import styles from './Day.module.css';

export default function Day({
    day, 
    disableDay = false,
    sunday = false,
    today = false,
    saturday = false,
    onClick = () => {},
}){

    const selector = disableDay || day === 0 ? [] : [`${styles.circlehover}`];
    const styleList = [`${styles.day}`]


    if(sunday) styleList.push(`${styles.sunday}`)
    if(saturday) styleList.push(`${styles.saturday}`)
    if(today) styleList.push(`${styles.today}`)

    return (
            <div className={`${selector.join(' ')} ${styleList.join(' ')}`} onClick={() => {
                if(day !== 0) onClick(day)
            }}>
                {day === 0 ? '' : <p>{day}</p> }
            </div>
        )
}