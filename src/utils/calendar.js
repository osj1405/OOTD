export const buildCalendar = (year, month) => {
    const calendar = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month, 0);

    const firstDayOfWeek = firstDay.getDay();

    let week = [];
    let day = 1;

    for(let i = 0; i < firstDayOfWeek; i++){
        week.push(0);
    }

    while(day <= lastDay.getDate()){
        if(week.length === 7){
            calendar.push(week);
            week = [];
        }
        week.push(day);
        day++;
    }

    if(week.length > 0){
        for(let i = week.length; i < 7; i++){
            week.push(0);
        }
        calendar.push(week);
    }

    return calendar;


}