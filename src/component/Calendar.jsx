import styles from "./Calendar.module.css";
import { useState } from "react";
import { buildCalendar } from "../utils/calendar";
import Month from "./Month";
import Week from "./Week";
import Day from "./Day";
export default function Calendar(){
    const today = new Date();
    console.log(today);
    const [day, setDay] = useState(new Date());
    const [month, setMonth] = useState(today.getMonth() + 1)
    const [year, setYear] = useState(today.getFullYear());
    // setToday는 날짜 클릭해서 변경할 때 사용하기

    const calendar = buildCalendar(year, month-1);

    const week = ["Sun", "Mon", "Thu", "Wen", "Thr", "Fri", "Sat"];

    const previousMonth = () => {
        if(month === 1){
            setYear(year-1);
            setMonth(12);
        } else {
            setMonth(month-1);
        }
    }

    const nextMonth = () => {
        if(month === 12){
            setYear(year + 1);
            setMonth(1);
        } else {
            setMonth(month + 1);
        }
    }

    const onSelectDay = (day) => {
        setDay(day)
        console.log(day);
    }

    const onGoToday = () => {
        setDay(today);
        setYear(new Date().getFullYear());
        setMonth(new Date().getMonth() + 1);
    }

    return (
        <>
        <div className={styles.container}>
            <div className={styles.selectMonth}>
                <button 
                    className={styles.button}
                    onClick={()=> previousMonth()
                    }>{'<'}</button>
                <h2>{month}월</h2>
                <button 
                    className={styles.button}
                    onClick={()=> nextMonth()
                    }>{'>'}</button>
                <div className={styles.todayContainer}>
                    <button
                        className={styles.goToday}
                        onClick={()=>{
                            onGoToday()
                        }}>
                        Today
                    </button>
                </div>
            </div>
            <Week>
                {week.map((dayofweek, i) => {
                    return (
                        <Day key={i} day={dayofweek} onClick={onSelectDay} sunday={i ===0 }></Day>
                    )
                })}
            </Week>
            {calendar.map((week, i) => {
                return(
                    <Month key={i} week={week} year={year} month={month} onSelectDay={onSelectDay}></Month>
                ) 
            })}
            </div>
        </>
    )
}