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
}

class newDate {
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth();
  day: number = new Date().getDay()
}