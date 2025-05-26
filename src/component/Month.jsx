import Week from "./Week"
import Day from "./Day"

export default function Month({week, year, month, onSelectDay}){
    const today = new Date()
    return (
        <Week>
            {week.map((day, i) => {
                return(
                <Day key={i} day={day} sunday={i === 0} saturday={i === 6} today={year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate()} onClick={onSelectDay}></Day>
                )
            })}
        </Week>
    )
}