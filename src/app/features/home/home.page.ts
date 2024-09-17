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

  dates: Array<newDate> = [];
  selectedDate: { year: number; month: number; day: number; } | undefined;
  loading = false;
  nextMonth = new Date()

  year = new Date().getFullYear()
  month = this.visibleDate.getMonth() + 1

  matchdata: any = []

  constructor() {
    this.getProgress()
  }

  // Lifecycle
  ionViewDidEnter() {
  }

  // Methods
  format(data: Date) {
    var
      dia = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0' + dia : dia,
      mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0' + mes : mes,
      anoF = data.getFullYear();
    return mesF + "/" + diaF + "/" + anoF;
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

  // Events
  getProgress() {
    let start = new Date("01/01/" + this.year);
    let end = new Date("12/31/" + this.year);

    let loop = new Date(start);
    while (loop <= end) {
      let stringData = this.format(loop)

      this.matchdata.push([stringData, this.getGoaldoc()])
      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
  }

  getGoaldoc() {
    this.goaldocstore.getGoals();

    return Math.floor(Math.random() * 6)
  }
}

class newDate {
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth();
  day: number = new Date().getDay()
}
