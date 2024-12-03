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
import { HelperService } from 'src/app/services/helper.service';
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
  day = signal(new Date());
  formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  dayFormatted = signal(this.formatter.format(this.day()));
  habitCount: any = signal(0);
  habitGriddoc: HabitGriddoc = new HabitGriddoc()
  newGoal: Goal = new Goal()
  newGoaldoc: Goaldoc = new Goaldoc()
  name: string = ''
  planner: Array<any> = []
  habitslist: Array<any> = []
  times: Array<any> = []

  constructor(private goalService: GoalService, private modalCtrl: ModalController, public helperService: HelperService,
    public habitGridService: HabitGridService, public popoverController: PopoverController
  ) {
    this.getGoaldoc();
    this.habitgriddocstore.getHabitGriddoc()
  }

  // Lifecycle
  ionViewDidEnter() { }

  // Methods
  getGoaldoc() {
    this.goaldocstore.getGoals();
  }

  getHabitGriddoc() {
    this.habitgriddocstore.getHabitGriddoc();
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

  // Events
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

  async habitChecked(goalid: number, index: number, habit: Habit) {
    if (habit.datesCompleted?.find(date => date == this.helperService.format(this.day()))) {
      habit.datesCompleted?.splice(habit.datesCompleted.findIndex((item) => item == this.helperService.format(this.day())), 1)
    } else {
      habit.datesCompleted?.push(this.helperService.format(this.day()))
    }
    let goaldoc = this.goaldocstore.goals().find(goal => goal.id == goalid)

    if (this.filterSegment.value == "plan") {
      goaldoc?.goal?.habits.splice(index, 1, habit)
    }

    this.updateHabitGrid()
    await this.goaldocstore.saveGoaldoc(goaldoc)
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

  async openHabitModal(roletype: string, goalid: number, habit?: Habit) {
    const modal = await this.modalCtrl.create({
      component: HabitModalComponent,
      componentProps: {
        role: roletype,
        goalid: goalid,
        habitprop: habit
      },
      initialBreakpoint: 0.40,
      breakpoints: [0, 0.40, 1],
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
      initialBreakpoint: 0.40,
      breakpoints: [0, 0.40, 1],
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

  async openMilestoneListPopover(e: Event, goaldoc?: Goaldoc) {
    const popover = await this.popoverController.create({
      component: MilestoneListComponent,
      cssClass: 'popover-list',
      event: e,
      componentProps: {
        goaldocprop: goaldoc,
        goaldate: this.day()
      },
      backdropDismiss: true,
      translucent: true
    });
    popover.present();
    const { data, role } = await popover.onWillDismiss();
    console.log(data)
    console.log(role)

    if (data) {
      // this.goal = data.goal
      console.log(data.goal)
      // this.updateHabitGrid(milestone?.isComplete!, milestone?.dateCompleted!)
      this.goaldocstore.saveGoaldoc(data)
    }
    // this.milestoneslide?.closeOpened()
  }

  segmentClicked() {
    if (this.filterSegment.value == "plan") {
      this.habitslist = new Array<any>()
      this.goaldocstore.goals().forEach(goal => {
        if (this.day() >= this.helperService.formatToDate(goal.goal?.startdate!) && this.day() <= this.helperService.formatToDate(goal.goal?.enddate!)) {
          goal.goal?.habits.forEach((habit, index) => {
            this.habitslist.push({ goalid: goal.id, index: index, habit: habit })
          })
        }
      })
      this.habitslist.sort((a, b) => this.helperService.convertTo24Hour(a.habit?.time) - this.helperService.convertTo24Hour(b.habit?.time))
      // console.log(this.habitslist)
      this.planner = this.groupedByTime()
      console.log(this.planner)
      this.times = [...new Set(this.times)]
    }
  }
}

