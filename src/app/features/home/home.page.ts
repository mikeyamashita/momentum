import { Component, inject, signal, ViewChild } from '@angular/core';
import {
  IonHeader, IonToolbar, IonContent, IonButton, IonCheckbox,
  IonItemOption, IonItemOptions,
  IonItem, IonItemSliding, IonList, IonLabel, IonIcon, IonFabButton, IonFab, IonSegment, IonSegmentButton,
  ModalController
} from '@ionic/angular/standalone';

import { GoaldocStore } from '../goal/stores/goaldoc.store';
import { HabitGriddocStore } from '../goal/stores/habitgriddoc.store';
import { GraphComponent } from '../graph/graph.component';
import { Habit } from '../goal/models/habit';
import { HabitGriddoc } from '../goal/models/habitgriddoc';
import { Goaldoc } from '../goal/models/goaldoc';
import { GoalService } from '../goal/services/goal.service';
import { FormsModule } from '@angular/forms';
import { Goal } from '../goal/models/goal';
import { HabitModalComponent } from './habit-modal/habit-modal.component';
import { GoalModalComponent } from './goal-modal/goal-modal.component';
import { HelperService } from 'src/app/helper.service';
import { HabitGrid } from '../goal/models/habitgrid';
import { HabitGridService } from '../goal/services/habitgrid.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonSegmentButton, IonSegment, IonFabButton, IonIcon, IonLabel, IonList, IonItem,
    IonItemSliding, IonItemOptions, IonItemOption,
    IonCheckbox, IonButton, IonHeader, IonToolbar, IonContent,
    IonFab,
    GraphComponent, FormsModule]
})
export class HomePage {
  readonly goaldocstore = inject(GoaldocStore);
  readonly habitgriddocstore = inject(HabitGriddocStore);
  @ViewChild('habitslide') habitslide!: IonItemSliding;
  @ViewChild('filterSegment') filterSegment!: IonSegment;

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
  planner: Array<any> = []
  habitslist: Array<any> = []
  times: Array<any> = []

  constructor(private goalService: GoalService, private modalCtrl: ModalController, private helperService: HelperService,
    public habitGridService: HabitGridService
  ) {
    this.getGoaldoc();
    this.habitgriddocstore.getHabitGriddoc()
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

  formatToDate(datestring: Date): Date {
    return new Date(datestring)
  }


  // Events
  getGoaldoc() {
    this.goaldocstore.getGoals();
  }

  getHabitGriddoc() {
    this.habitgriddocstore.getHabitGriddoc();
  }

  habitChecked(goalid: number, index: number, habit: Habit) {
    if (habit.datesCompleted?.find(date => date == this.helperService.format(this.day()))) {
      habit.datesCompleted?.splice(habit.datesCompleted.findIndex((item) => item == this.helperService.format(this.day())), 1)
    } else {
      habit.datesCompleted?.push(this.helperService.format(this.day()))
    }
    let goaldoc = this.goaldocstore.goals().find(goal => goal.id == goalid)

    if (this.filterSegment.value == "plan") {
      goaldoc?.goal?.habits.splice(index, 1, habit)
      // goaldoc?.goal?.habits.push(habit)
    }

    this.updateHabitGrid()
    this.goaldocstore.saveGoaldoc(goaldoc)
  }

  isComplete(habit: Habit) {
    return habit.datesCompleted?.some((item) => item == this.helperService.format(this.day()))
  }

  updateHabitGrid() {
    let progress = this.goalService.getProgressCount(this.goaldocstore.goals(), this.day())
    let findDateInMatrix = this.habitgriddocstore.habitMatrix().find(matrix => matrix[0] === this.helperService.format(this.day()))

    if (findDateInMatrix) {
      // get habitgrid by current day
      this.habitgriddocstore.habitMatrix().forEach((habitmatrix) => {
        if (habitmatrix[0] === this.helperService.format(this.day())) {
          // update progress
          let newhabitgriddoc: HabitGriddoc = new HabitGriddoc()
          let newhabitgrid: HabitGrid = new HabitGrid()
          newhabitgriddoc.id = habitmatrix[2]
          newhabitgrid.date = habitmatrix[0]
          newhabitgrid.progress = progress
          newhabitgrid.milestones = habitmatrix[3]
          newhabitgriddoc.habitGrid = newhabitgrid
          this.habitgriddocstore.saveHabitGriddoc(newhabitgriddoc)
        }
      })
    } else {
      // console.log('not found')
      let newhabitgriddoc: HabitGriddoc = new HabitGriddoc()
      let newhabitgrid: HabitGrid = new HabitGrid()
      newhabitgrid.date = this.helperService.format(this.day())
      newhabitgrid.progress = progress
      newhabitgrid.milestones = 0
      newhabitgriddoc.habitGrid = newhabitgrid
      this.habitgriddocstore.addHabitGriddoc(newhabitgriddoc) //adds date if it doesnt exist
    }
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

  async openHabitModal(roletype: string, goalid: number, habit?: Habit) {
    const modal = await this.modalCtrl.create({
      component: HabitModalComponent,
      componentProps: {
        role: roletype,
        goalid: goalid,
        habitprop: habit
      },
      cssClass: "small-modal",
      backdropDismiss: true,
      backdropBreakpoint: 0,
      presentingElement: await this.modalCtrl.getTop() // Get the top-most ion-modal
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    // this.habitGridService.buildHabitMatrix(this.habitgriddocstore.habitgriddoc())
    if (data) {
      this.updateHabitGrid()
      this.goaldocstore.saveGoaldoc(data)
    }
    this.habitslide?.closeOpened()
  }

  async openGoalModal(roletype: string, goaldoc?: Goaldoc) {
    const modal = await this.modalCtrl.create({
      component: GoalModalComponent,
      componentProps: {
        role: roletype,
        goaldocprop: goaldoc,
        goaldate: this.day()
      },
      initialBreakpoint: 0.99,
      breakpoints: [0, 0.99, 1],
      backdropDismiss: true,
      backdropBreakpoint: 0,
      presentingElement: await this.modalCtrl.getTop() // Get the top-most ion-modal
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log(data)
    this.newGoal.name = data?.name
    this.newGoal.description = data?.description
    this.newGoal.startdate = data?.startdate
    this.newGoal.enddate = data?.enddate
    this.newGoal.habits = data?.habits
    this.newGoal.milestones = data?.milestones
    this.newGoaldoc.goal = this.newGoal
    if (role == 'addGoal') {
      this.goaldocstore.addGoaldoc(this.newGoaldoc)
    } else if (role === 'saveGoal') {
      this.newGoaldoc.id = goaldoc?.id
      this.goaldocstore.saveGoaldoc(this.newGoaldoc)
    } else if (role === 'deleteGoal') {
      this.goaldocstore.deleteGoaldoc(goaldoc?.id!)
    }
    // this.updateHabitGrid()
  }

  convertTo24Hour(time: any) {
    console.log(time)
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

  groupedByTime() {
    const groupbytime = this.habitslist?.reduce((group, habitarr) => {
      const time: string = habitarr.habit.time;
      if (!group[time]) {
        group[time] = [];
      }
      group[time].push(habitarr);
      this.times.push(time)
      return group;
    }, {});
    return groupbytime
  }

  segmentClicked() {
    // if (this.filterSegment.value == "goals") {
    //   this.habitslist = []
    //   this.planner = []
    //   this.times = []
    // } else 
    if (this.filterSegment.value == "plan") {
      this.habitslist = new Array<any>()
      this.goaldocstore.goals().forEach(goal => {
        if (this.day() >= this.formatToDate(goal.goal?.startdate!) && this.day() <= this.formatToDate(goal.goal?.enddate!)) {
          goal.goal?.habits.forEach((habit, index) => {
            this.habitslist.push({ goalid: goal.id, index: index, habit: habit })
          })
        }
      })
      this.habitslist.sort((a, b) => this.convertTo24Hour(a.habit?.time) - this.convertTo24Hour(b.habit?.time))
      // console.log(this.habitslist)
      this.planner = this.groupedByTime()
      console.log(this.planner)
      this.times = [...new Set(this.times)]
    }
  }
}

class newDate {
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth();
  day: number = new Date().getDay()
}
