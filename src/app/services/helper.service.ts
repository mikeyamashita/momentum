import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  year = new Date().getFullYear()

  constructor() { }

  format(data: Date) {
    var
      date = data?.getDate().toString(),
      dayF = (date.length == 1) ? '0' + date : date,
      month = (data?.getMonth() + 1).toString(),
      monthF = (month.length == 1) ? '0' + month : month,
      year = data?.getFullYear();
    return monthF + "/" + dayF + "/" + year;
  }


  formatDateString(datestring: string) {
    let data: Date = new Date(datestring)
    return this.format(data)
  }

  formatDateTime(time: any) {
    let datetime: Date = new Date()
    if (time) {
      let [hour, minutePeriod] = time.split(":");
      let minute = minutePeriod.slice(0, 2);
      let period = minutePeriod.slice(3, 2).toUpperCase();
      console.log(period)
      hour = parseInt(hour, 10);
      minute = parseInt(minute, 10);

      // Convert hour to 24-hour format
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      datetime.setHours(hour)
      datetime.setMinutes(minute)

      const timezoneOffset = datetime.getTimezoneOffset();
      const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
      const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
      const sign = timezoneOffset > 0 ? '-' : '+';
      const formattedOffset = `${sign}${offsetHours}:${offsetMinutes}`;

      console.log(datetime)
      return datetime.toISOString().split('T')[1].split('.')[0].slice(0, 5)
      // console.log(datetime.toISOString().split('.')[0])
    } else {
      return null
    }
  }

  getNumberOfDaysInMonth(month: number) {
    return new Date(this.year, month, 0).getDate();
  }

  getMonthName(date: newDate): string {
    const thedate = new Date(date.year, date.month, date.day);
    const month = thedate.toLocaleString('default', { month: 'long' });
    const year = thedate.toLocaleString('default', { year: 'numeric' });
    return month + ' ' + year
  }

  formatToDate(datestring: Date): Date {
    return new Date(datestring)
  }

  convertTo24Hour(time: any) {
    if (time) {
      let [hour, minutePeriod] = time.split(":");
      let minute = minutePeriod.slice(0, 2);
      let period = minutePeriod.slice(3).toUpperCase();

      hour = parseInt(hour, 10);
      minute = parseInt(minute, 10);

      // Convert hour to 24-hour format
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      return hour * 60 + minute; // Total minutes since midnight
    } else {
      return null
    }
  };
}

class newDate {
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth();
  day: number = new Date().getDay()
}