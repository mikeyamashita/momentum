import { Component, inject, signal, ViewChild } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonCheckbox, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonCardSubtitle,
  IonItem, IonList, IonLabel, IonIcon, IonFabButton, IonFab, IonFabList, IonSegment, IonSegmentButton, IonModal, IonInput
} from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core/components';

import { GoaldocStore } from '../goal/stores/goaldoc.store';
import { HabitGriddocStore } from '../goal/stores/habitgriddoc.store';
import { GraphComponent } from '../graph/graph.component';
import { Habit } from '../goal/models/habit';
import { HabitGriddoc } from '../goal/models/habitgriddoc';
import { Goaldoc } from '../goal/models/goaldoc';
import { GoalService } from '../goal/services/goal.service';
import { FormsModule } from '@angular/forms';
import { Goal } from '../goal/models/goal';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonModal, IonSegmentButton, IonSegment, IonFabList, IonFabButton, IonIcon, IonLabel, IonList, IonItem,
    IonCardSubtitle, IonCardHeader, IonCardTitle, IonCardContent, IonCard, IonInput,
    IonCheckbox, IonButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent,
    IonFab,
    GraphComponent, FormsModule]
})
export class HomePage {
  readonly goaldocstore = inject(GoaldocStore);
  readonly habitgriddocstore = inject(HabitGriddocStore);

  @ViewChild(IonModal) modal!: IonModal;

  year = new Date().getFullYear()
  today: Date = new Date()
  day = signal(new Date());
  formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  dayFormatted = signal(this.formatter.format(this.day()));

  habitCount: any = signal(0);

  habitGriddoc: HabitGriddoc = new HabitGriddoc()
  newGoal: Goal = new Goal()
  newGoaldoc: Goaldoc = new Goaldoc()
  name: string = ''

  matchdata: any = []

  constructor(private goalService: GoalService) {
    this.getGoaldoc();
  }

  // Lifecycle
  ionViewDidEnter() {
  }

  // Methods
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
  getGoaldoc() {
    this.goaldocstore.getGoals();
  }

  getHabitGriddoc() {
    this.habitgriddocstore.getHabitGrid();
  }

  getProgress() {
    let start = new Date("09/01/" + this.year);
    let end = new Date("09/30/" + this.year);

    let loop = new Date(start);
    while (loop <= end) {
      let stringData = this.goalService.format(loop)

      this.matchdata.push([stringData, this.getGoaldoc()])
      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
  }

  update() {
    this.goaldocstore.getGoals();
  }

  habitChecked(goaldoc: Goaldoc | undefined, habit: Habit) {
    if (habit.datesCompleted?.find(date => date == this.goalService.format(this.day()))) {
      habit.datesCompleted?.splice(habit.datesCompleted.findIndex((item) => item == this.goalService.format(this.day())), 1)
    } else {
      habit.datesCompleted?.push(this.goalService.format(this.day()))
    }
    this.goaldocstore.saveGoaldoc(goaldoc)
  }

  isComplete(habit: Habit) {
    return habit.datesCompleted?.some((item) => item == this.goalService.format(this.day()))
  }

  changeDay(direction: number) {
    if (direction === 1) {
      this.day().setDate(this.day().getDate() + 1)
      this.dayFormatted.set((this.formatter.format(this.day())))
    }
    else if (direction === -1) {
      this.day().setDate(this.day().getDate() - 1)
      this.dayFormatted.set((this.formatter.format(this.day())))
    }
  }

  addNewGoal() {
    this.modal.dismiss(this.newGoal, 'save');
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  addHabit() {

  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<Goal>>;
    if (ev.detail.role === 'save') {
      this.newGoal.name = ev.detail.data?.name!
      this.newGoal.description = ev.detail.data?.description!
      this.newGoaldoc.goal = this.newGoal
      this.goaldocstore.addGoaldoc(this.newGoaldoc)
    }
  }
}

class newDate {
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth();
  day: number = new Date().getDay()
}
