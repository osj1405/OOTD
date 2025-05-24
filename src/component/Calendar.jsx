import styles from "./Calendar.module.css";
import { useState } from "react";
import { buildCalendar } from "../utils/calendar";
import Month from "./Month";
import Week from "./Week";
import Day from "./Day";
export default function Calendar(){
    const [today, setToday] = useState(new Date());
    // setToday는 날짜 클릭해서 변경할 때 사용하기

    const year = today.getFullYear();
    const month = today.getMonth();

    const calendar = buildCalendar(year, month);

    const week = ["Sun", "Mon", "Thu", "Wen", "Thr", "Fri", "Sat"];

    return (
        <>
        <div className={styles.container}>
            <h2>Calendar</h2>
            <Week>
                {week.map((dayofweek, i) => {
                    return (
                        <Day key={i} day={dayofweek}></Day>
                    )
                })}
            </Week>
            {calendar.map((week, i) => {
                return(
                    <Month key={i} week={week}></Month>
                ) 
            })}
            </div>
        </>
    )
}