import styles from "./Calendar.module.css";
import { useState } from "react";
import { buildCalendar } from "../utils/calendar";
import Month from "./Month";
import Week from "./Week";
import Day from "./Day";
export default function Calendar(){
    const [today, setToday] = useState(new Date());
    const [month, setMonth] = useState(today.getMonth())
    // setToday는 날짜 클릭해서 변경할 때 사용하기

    const year = today.getFullYear();

    const calendar = buildCalendar(year, month);

    const week = ["Sun", "Mon", "Thu", "Wen", "Thr", "Fri", "Sat"];

    return (
        <>
        <div className={styles.container}>
            <div className={styles.selectMonth}>
                <button 
                    className={styles.button}
                    onClick={()=>
                        setMonth(month - 1)
                    }>{'<'}</button>
                <h2>{month + 1}월</h2>
                <button 
                    className={styles.button}
                    onClick={()=>
                        setMonth(month + 1)
                    }>{'>'}</button>
            </div>
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