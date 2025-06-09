
export const buildCalendar = (year:number, month:number): Date[][] => {
    const calendar = []
    let week = [];

    const firstDate = new Date(year, month - 1, 1)
    const lastDate = new Date(year,  month, 0)

    const firstDateDay = firstDate.getDay()
    const lastDateDay = lastDate.getDay()

    lastDate.setDate(lastDate.getDate() + (7 - lastDateDay))

    const currentDate = new Date(month === 1 ? year - 1 : year , month === 1 ? 12 : month - 1, 1 - firstDateDay);

    for(let i = 0; i < firstDateDay; i++){
        week.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
    }

    while(currentDate < lastDate){
        if(week.length === 7){
            calendar.push(week)
            // eslint-disable-next-line no-const-assign
            week = []
        }
        week.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1)
    }

    if(week.length > 0){
        calendar.push(week);
        week=[];
    }
  
    return calendar;

}