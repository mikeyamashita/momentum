import { Component, inject, signal, ViewChild } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonCheckbox, IonCard, IonCardContent, IonCardTitle,
  IonCardHeader, IonCardSubtitle, IonItemOption, IonItemOptions,
  IonItem, IonItemSliding, IonList, IonLabel, IonIcon, IonFabButton, IonFab, IonFabList, IonSegment, IonSegmentButton,
  IonModal, IonInput, ModalController
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
  imports: [IonModal, IonSegmentButton, IonSegment, IonFabList, IonFabButton, IonIcon, IonLabel, IonList, IonItem,
    IonItemSliding, IonItemOptions,
    IonCardSubtitle, IonCardHeader, IonCardTitle, IonCardContent, IonCard, IonInput, IonItemOption,
    IonCheckbox, IonButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent,
    IonFab,
    GraphComponent, FormsModule]
})
export class HomePage {
  readonly goaldocstore = inject(GoaldocStore);
  readonly habitgriddocstore = inject(HabitGriddocStore);

  // @ViewChild('modalgoal') modalgoal!: IonModal;
  // @ViewChild('modalhabit') modalhabit!: IonModal;
  @ViewChild('habitslide') habitslide!: IonItemSliding;

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

  habitChecked(goaldoc: Goaldoc | undefined, habit: Habit) {
    if (habit.datesCompleted?.find(date => date == this.helperService.format(this.day()))) {
      habit.datesCompleted?.splice(habit.datesCompleted.findIndex((item) => item == this.helperService.format(this.day())), 1)
    } else {
      habit.datesCompleted?.push(this.helperService.format(this.day()))
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
      initialBreakpoint: 0.99,
      breakpoints: [0, 0.99, 1],
      backdropDismiss: true,
      backdropBreakpoint: 0,
      presentingElement: await this.modalCtrl.getTop() // Get the top-most ion-modal
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    // this.habitGridService.buildHabitMatrix(this.habitgriddocstore.habitgriddoc())
    this.updateHabitGrid()
    this.goaldocstore.saveGoaldoc(data)
    this.habitslide?.closeOpened()
  }

  async openGoalModal(roletype: string, goaldoc?: Goaldoc) {
    const modal = await this.modalCtrl.create({
      component: GoalModalComponent,
      componentProps: {
        role: roletype,
        goaldocprop: goaldoc
      },
      initialBreakpoint: 0.99,
      breakpoints: [0, 0.99, 1],
      backdropDismiss: true,
      backdropBreakpoint: 0,
      presentingElement: await this.modalCtrl.getTop() // Get the top-most ion-modal
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    this.newGoal.name = data?.name
    this.newGoal.description = data?.description
    this.newGoal.startdate = data?.startdate
    this.newGoal.enddate = data?.enddate
    this.newGoal.habits = data?.habits
    this.newGoaldoc.goal = this.newGoal
    if (role == 'addGoal') {
      this.goaldocstore.addGoaldoc(this.newGoaldoc)
    } else if (role === 'saveGoal') {
      this.newGoaldoc.id = goaldoc?.id
      this.goaldocstore.saveGoaldoc(this.newGoaldoc)
    } else if (role === 'deleteGoal') {
      this.goaldocstore.deleteGoaldoc(goaldoc?.id!)
    }
  }
}

class newDate {
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth();
  day: number = new Date().getDay()
}
