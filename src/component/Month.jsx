import Week from "./Week"
import Day from "./Day"

export default function Month({week, year, month, onSelectDay}){
    const today = new Date();
    const currentMonth = month;
    return (
        <Week>
            {week.map((day, i) => {
                return(
                <Day key={i} year={year} month={month} day={day} sunday={i === 0} saturday={i === 6}
                anotherMonth={day.getMonth() + 1 !== currentMonth} 
                today={day.getFullYear() === today.getFullYear() && day.getMonth() === today.getMonth() && day.getDate() === today.getDate()}
                onClick={onSelectDay}
                ></Day>
                )
            })}
        </Week>
    )
}