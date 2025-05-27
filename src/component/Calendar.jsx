import styles from "./Calendar.module.css";
import { useState } from "react";
import { buildCalendar } from "../utils/calendar";
import Month from "./Month";
import Week from "./Week";
import Day from "./Day";
export default function Calendar(){
    const today = new Date();
    // eslint-disable-next-line no-unused-vars
    const [selectedDay, setSelectedDay] = useState(today);
    const [month, setMonth] = useState(today.getMonth() + 1)
    const [year, setYear] = useState(today.getFullYear());
    // setToday는 날짜 클릭해서 변경할 때 사용하기

    const calendar = buildCalendar(year, month);

    const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const previousMonth = () => {
        if(month === 1){
            setYear(prev => prev - 1);
            setMonth(12);
        } else {
            setMonth(prev => prev - 1);
        }
    }

    const nextMonth = () => {
        if(month === 12){
            setYear(prev => prev + 1);
            setMonth(1);
        } else {
            setMonth(prev => prev + 1);
        }
    }

    const onSelectDay = (day) => {
        setSelectedDay(day)
        console.log(`select Day: ${selectedDay}`);
    }

    const onGoToday = () => {
        const now = new Date();
        setSelectedDay(now);
        setYear(now.getFullYear());
        setMonth(now.getMonth() + 1);
    }

    return (
        <>
        <div className={styles.container}>
            <div className={styles.selectMonth}>
                <button 
                    className={styles.button}
                    onClick={()=> previousMonth()
                    }>{'<'}</button>
                <h2>{month.toString()}월</h2>
                <button 
                    className={styles.button}
                    onClick={()=> nextMonth()
                    }>{'>'}</button>
                <div className={styles.todayContainer}>
                    <p className={styles.today}>{`${today.getMonth()+1}월 ${today.getDate()}일`}</p>
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
                {week.map((day, i) => {
                    return (
                        <Day key={i} day={day} year={year} month={month} sunday={i === 0 }></Day>
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