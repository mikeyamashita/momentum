import { Injectable } from '@angular/core';
import { h } from 'ionicons/dist/types/stencil-public-runtime';
import { timer } from 'ionicons/icons';

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
    if (time) {
      let [hourPeriod, minutePeriod] = time.split(":");
      let hour = hourPeriod.slice(0, 2);
      let minute = (minutePeriod.slice(0, 2));
      let timeWithPeriod;
      if (Number(hour) > 12) {
        timeWithPeriod = Number(hour) - 12 + ':' + minute + "PM"
      } else {
        timeWithPeriod = hour + ':' + minute + "AM"
      }
      return timeWithPeriod
    } else
      return null
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