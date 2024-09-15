import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton, IonCheckbox } from '@ionic/angular/standalone';
import { GoaldocStore } from '../goal/stores/goaldoc.store';
import { GraphComponent } from '../graph/graph.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonCheckbox, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, GraphComponent],
})
export class HomePage {
  readonly goaldocstore = inject(GoaldocStore);
  readonly calendar: Array<Date> = new Array<Date>()

  readonly months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  readonly dayOfWeekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  readonly todaysDate = new Date().toDateString()
  readonly numOfDaysInMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
  readonly monthNum = new Date(2024, 1, 0).getMonth();
  readonly daysInMonth: Array<number> = []
  currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getMonth()
  visibleDate = new Date()

  constructor() {
    this.loadCurrentMonth()
  }

  // Lifecycle
  ionViewDidEnter() {
    this.goaldocstore.getGoals();
  }

  dates: Array<newDate> = [];
  selectedDate: { year: number; month: number; day: number; } | undefined;
  loading = false;
  nextMonth = new Date()

  year = new Date().getFullYear()
  month = this.visibleDate.getMonth() + 1

  matchdata = [
    ['01/21/2024', '1'],
    ['06/20/2024', '2'],
    ['12/25/2024', '3'],
    ['11/05/2024', '3'],
  ]

  loadCurrentMonth() {
    for (let day = 1; day <= this.getNumberOfDaysInMonth(this.month); day++) { // Assuming each month has at most 31 days, adjust as needed.
      this.dates.push({
        year: this.year,
        month: this.month,
        day: day
      });
    }
  }

  loadMoreDates() {
    let endMonth = this.dates[this.dates.length - 1]?.month
    let endYear = this.dates[this.dates.length - 1]?.year
    if (endMonth == 12) {
      endMonth = 1
      endYear++;
    } else {
      endMonth++;
    }

    for (let day = 1; day <= this.getNumberOfDaysInMonth(endMonth + 1); day++) { // Assuming each month has at most 31 days, adjust as needed.
      this.dates.push({
        year: endYear,
        month: endMonth,
        day: day
      });
    }
    console.log(this.dates)
  }


  loadPreviousDates() {
    let startMonth = this.dates[0]?.month
    let startYear = this.dates[0]?.year
    if (startMonth == 1) {
      startMonth = 12
      startYear--;
    } else {
      startMonth--;
    }

    for (let day = this.getNumberOfDaysInMonth(startMonth + 1); day >= 1; day--) { // Assuming each month has at most 31 days, adjust as needed.
      this.dates.unshift({
        year: startYear,
        month: startMonth,
        day: day
      });
    }
    console.log(this.dates)
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


}

class newDate {
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth();
  day: number = new Date().getDay()
}
