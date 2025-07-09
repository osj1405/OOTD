import styles from "./Calendar.module.css";
import { useState, useEffect } from "react";
import { buildCalendar } from "../utils/calendar";
import Week from "./Week";
import Day from "./Day";

interface CalenderProps {
    selectedDay?: Date;
    onSelectDay?: (day: Date) => void;
}

export default function Calendar({ 
    selectedDay, 
    onSelectDay = () => {}
}: CalenderProps){
    const today = new Date();
    // eslint-disable-next-line no-unused-vars
    // const [selectedDay, setSelectedDay] = useState(today);
    const [month, setMonth] = useState(today.getMonth() + 1)
    const [year, setYear] = useState(today.getFullYear());
    // setToday는 날짜 클릭해서 변경할 때 사용하기

    useEffect(() => {
        console.log(`select: ${selectedDay}`)
    }, [selectedDay])

    const calendar: Date[][] = buildCalendar(year, month);

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


    const onGoToday = () => {
        const now = new Date();
        onSelectDay(now);
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
                        onClick={onGoToday}>
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
                return (
                    <Week key={i}>
                        {week.map((day, j) => {
                            return(
                                <Day 
                                key={j} 
                                year={year} 
                                month={month} 
                                day={day} 
                                sunday={j === 0} 
                                saturday={j === 6}
                                anotherMonth={day.getMonth() + 1 !== month} 
                                today={day.getFullYear() === today.getFullYear() && day.getMonth() === today.getMonth() && day.getDate() === today.getDate()}
                                onClick={onSelectDay}  
                                selected={selectedDay?.getTime() === day.getTime()} 
                                ></Day>
                            )
                        })}
                     </Week>
                )
            }
            )}
            </div>
        </>
    )
}