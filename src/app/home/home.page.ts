import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import {
  IonHeader, IonToolbar, IonContent, IonButton, IonCheckbox,
  IonItemOption, IonItemOptions,
  IonItem, IonItemSliding, IonList, IonLabel, IonIcon, IonFabButton, IonFab, IonSegment, IonSegmentButton,
  ModalController, IonPopover, PopoverController
} from '@ionic/angular/standalone';

import { GoaldocStore } from '../features/goal/stores/goaldoc.store';
import { HabitGriddocStore } from '../features/habitgrid/stores/habitgriddoc.store';
import { GraphComponent } from '../features/habitgrid/components/graph/graph.component';
import { Habit } from '../features/habits/models/habit';
import { HabitGriddoc } from '../features/habitgrid/models/habitgriddoc';
import { Goaldoc } from '../features/goal/models/goaldoc';
import { GoalService } from '../features/goal/services/goal.service';
import { FormsModule } from '@angular/forms';
import { Goal } from '../features/goal/models/goal';
import { HabitModalComponent } from '../features/habits/components/habit-modal/habit-modal.component';
import { GoalModalComponent } from '../features/goal/components/goal-modal/goal-modal.component';
import { DateService } from 'src/app/services/date.service';
import { HabitGrid } from '../features/habitgrid/models/habitgrid';
import { MilestoneListComponent } from '../features/milestones/components/milestone-list/milestone-list.component';
import { HabitGridService } from '../features/habitgrid/services/habitgrid.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonPopover, IonSegmentButton, IonSegment, IonFabButton, IonIcon, IonLabel, IonList, IonItem,
    IonItemSliding, IonItemOptions, IonItemOption,
    IonCheckbox, IonButton, IonHeader, IonToolbar, IonContent,
    IonFab,
    GraphComponent, FormsModule, MilestoneListComponent]
})
export class HomePage {
  readonly goaldocstore = inject(GoaldocStore);
  readonly habitgriddocstore = inject(HabitGriddocStore);
  @ViewChild('habitslide') habitslide!: IonItemSliding;
  @ViewChild('filterSegment') filterSegment!: IonSegment;

  today: Date = new Date()
  habitCount: any = signal(0);
  habitGriddoc: HabitGriddoc = new HabitGriddoc()
  newGoal: Goal = new Goal()
  newGoaldoc: Goaldoc = new Goaldoc()
  name: string = ''
  planner: Array<any> = []
  habitslist: Array<any> = []
  times: Array<any> = []

  constructor(private goalService: GoalService, private modalCtrl: ModalController, public dateService: DateService,
    public habitGridService: HabitGridService, public popoverController: PopoverController
  ) {
    this.getGoaldoc();

    if (!localStorage.getItem("Init")) { //create habitgrid on inital load
      // this.habitGridService.rebuildHabitMatrix([], new Date().getFullYear()).then(
      //   res => {
      //     if (res)
      //       this.habitgriddocstore.getHabitGriddoc();
      //   }
      // )
      this.habitgriddocstore.newHabitMatrix(this.dateService.year)
      localStorage.setItem("Init", "true")
    } else {
      this.habitgriddocstore.getHabitGriddoc();
    }

  }

  // Lifecycle
  ionViewDidEnter() {
  }

  // Methods
  getGoaldoc() {
    this.goaldocstore.getGoals();
  }

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

  createNewYearMatchData(changedYear: number) {
    const isLeapYear = (year: number) => new Date(year, 1, 29).getMonth() === 1;
    let numberOfDays = isLeapYear(changedYear) ? 366 : 365
    if (this.habitGridService.matchDataCount(changedYear) < numberOfDays) {
      this.habitgriddocstore.newHabitMatrix(changedYear)
    }
  }


  // Events
  changeDay(direction: number) {
    let previousYear = this.dateService.day().getFullYear()
    if (direction === 1) {
      this.dateService.day().setDate(this.dateService.day().getDate() + 1)
      this.dateService.dayFormatted.set((this.dateService.formatter.format(this.dateService.day())))
    }
    else if (direction === -1) {
      this.dateService.day().setDate(this.dateService.day().getDate() - 1)
      this.dateService.dayFormatted.set((this.dateService.formatter.format(this.dateService.day())))
    }
    let changedYear = this.dateService.day().getFullYear()

    // console.log(previousYear)
    // console.log(changedYear)
    if (previousYear != changedYear)
      this.createNewYearMatchData(changedYear)
  }

  async habitChecked(goalid: number, index: number, habit: Habit) {
    if (habit.datesCompleted?.find(date => date == this.dateService.format(this.dateService.day()))) {
      habit.datesCompleted?.splice(habit.datesCompleted.findIndex((item) => item == this.dateService.format(this.dateService.day())), 1)
    } else {
      habit.datesCompleted?.push(this.dateService.format(this.dateService.day()))
    }
    let goaldoc = this.goaldocstore.goals().find(goal => goal.id == goalid)

    // if (this.filterSegment.value == "plan") {
    //   goaldoc?.goal?.habits.splice(index, 1, habit)
    // }

    this.updateHabitGrid()
    await this.goaldocstore.saveGoaldoc(goaldoc)
  }

  isComplete(habit: Habit) {
    return habit.datesCompleted?.some((item) => item == this.dateService.format(this.dateService.day()))
  }

  updateHabitGrid() {
    let progress = this.goalService.getProgressCount(this.goaldocstore.goals(), this.dateService.day())
    let findDateInMatrix = this.habitgriddocstore.habitMatrix().find(matrix => matrix[0] === this.dateService.format(this.dateService.day()))

    if (findDateInMatrix) {
      // get habitgrid by current day
      this.habitgriddocstore.habitMatrix().forEach((habitmatrix) => {
        if (habitmatrix[0] === this.dateService.format(this.dateService.day())) {
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
      // adds date if it doesnt exist
      let newhabitgriddoc: HabitGriddoc = new HabitGriddoc()
      let newhabitgrid: HabitGrid = new HabitGrid()
      newhabitgrid.date = this.dateService.format(this.dateService.day())
      newhabitgrid.progress = progress
      newhabitgrid.milestones = 0
      newhabitgriddoc.habitGrid = newhabitgrid
      this.habitgriddocstore.addHabitGriddoc(newhabitgriddoc)
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
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, .5],
      backdropDismiss: true,
      backdropBreakpoint: 0,
      presentingElement: await this.modalCtrl.getTop() // Get the top-most ion-modal
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    // this.habitGridService.buildHabitMatrix(this.habitgriddocstore.habitgriddoc())
    if (data) {
      console.log(data)
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
        goaldate: this.dateService.day()
      },
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, .5],
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

  async openMilestoneListPopover(e: Event, goaldoc?: Goaldoc) {
    const popover = await this.popoverController.create({
      component: MilestoneListComponent,
      cssClass: 'popover-list',
      event: e,
      componentProps: {
        goaldocprop: goaldoc,
        goaldate: this.dateService.day()
      },
      backdropDismiss: true,
      translucent: true
    });
    popover.present();
    const { data, role } = await popover.onWillDismiss();
    console.log(data)
    console.log(role)

    if (data) {
      // this.updateHabitGrid(milestone?.isComplete!, milestone?.dateCompleted!)
      this.goaldocstore.saveGoaldoc(data)
    }
  }

  segmentClicked() {
    if (this.filterSegment.value == "plan") {
      this.habitslist = new Array<any>()
      this.goaldocstore.goals().forEach(goal => {
        if (this.dateService.day() >= this.dateService.formatToDate(goal.goal?.startdate!) && this.dateService.day() <= this.dateService.formatToDate(goal.goal?.enddate!)) {
          goal.goal?.habits.forEach((habit, index) => {
            this.habitslist.push({ goalid: goal.id, index: index, habit: habit })
          })
        }
      })
      this.habitslist.sort((a, b) => this.dateService.convertTo24Hour(a.habit?.time) - this.dateService.convertTo24Hour(b.habit?.time))
      this.planner = this.groupedByTime()
      console.log(this.planner)
      this.times = [...new Set(this.times)]
    }
  }
}

