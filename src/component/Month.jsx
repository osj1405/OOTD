import Week from "./Week"
import Day from "./Day"

export default function Month({week}){
    return (
        <Week>
            {week.map((day, i) => {
                return(
                <Day key={i} day={day}></Day>
                )
            })}
        </Week>
    )
}