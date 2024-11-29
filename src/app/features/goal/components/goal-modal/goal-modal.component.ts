import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon,
  IonAlert, IonDatetime, IonDatetimeButton, IonPopover, IonToast,
  IonItem, IonList, IonLabel, IonInput, ModalController, IonCheckbox,
  IonItemSliding, IonItemOptions, IonItemOption
} from '@ionic/angular/standalone';
import { GoaldocStore } from '../../stores/goaldoc.store';
import { Goal } from '../../models/goal';
import { Goaldoc } from '../../models/goaldoc';
import { Milestone } from '../../../milestones/models/milestone';
import { GoalService } from '../../services/goal.service';
import { HelperService } from 'src/app/services/helper.service';
import { HabitGriddocStore } from '../../../habitgrid/stores/habitgriddoc.store';
import { HabitGriddoc } from '../../../habitgrid/models/habitgriddoc';
import { HabitGrid } from '../../../habitgrid/models/habitgrid';
import { MilestoneModalComponent } from '../../../milestones/components/milestone-modal/milestone-modal.component';

@Component({
  selector: 'app-goal-modal',
  templateUrl: './goal-modal.component.html',
  styleUrls: ['./goal-modal.component.scss'],
  standalone: true,
  imports: [IonLabel, IonList, IonItem, IonDatetime, IonDatetimeButton, IonToast,
    IonPopover, IonInput, IonButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonCheckbox,
    IonItemSliding, IonIcon, IonItemSliding, IonItemOptions, IonItemOption,
    IonAlert, FormsModule]
})
export class GoalModalComponent implements OnInit {
  readonly goaldocstore = inject(GoaldocStore);
  readonly habitgriddocstore = inject(HabitGriddocStore);

  @ViewChild('startdatepopover') startdatepopover!: IonPopover;
  @ViewChild('enddatepopover') enddatepopover!: IonPopover;
  @ViewChild('milestoneslide') milestoneslide!: IonItemSliding;

  // inputs
  role: string = ''
  goaldocprop: Goaldoc = new Goaldoc();
  goaldate: Date = new Date();

  // props
  goal: Goal = new Goal();
  goalid: number = 0;
  goaldoc: Goaldoc = new Goaldoc();
  isToastOpen: boolean = false;
  milestoneAchievedCount: number = 0

  alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'Yes',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  constructor(private modalCtrl: ModalController, public helperService: HelperService, private goalService: GoalService) {
  }

  ngOnInit() {
    if (this.goaldocprop) {
      this.goal = this.goaldocprop.goal!
      this.goalid = this.goaldocprop.id!
    }
    console.log(this.goal)
  }

  validate(role: string) {
    console.log(role)
    if (this.goal.startdate && this.goal.enddate) {
      if (role == 'add') {
        this.addGoal()
      } else if (role == 'save') {
        this.saveGoal()
      }
    } else
      this.isToastOpen = true

  }

  cancelGoalModal() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  addGoal() {
    return this.modalCtrl.dismiss(this.goal, 'addGoal');
  }

  saveGoal() {
    return this.modalCtrl.dismiss(this.goal, 'saveGoal');
  }

  deleteGoal(ev: any) {
    if (ev.detail.role === 'confirm')
      return this.modalCtrl.dismiss(this.goaldocprop.id!, 'deleteGoal');
    else
      return this.modalCtrl.dismiss(null, 'cancel');
  }

  selectStartDate(ev: any) {
    console.log(ev.detail.value)
    this.goal.startdate = new Date(ev.detail.value)
    this.startdatepopover.dismiss()
  }

  selectEndDate(ev: any) {
    this.goal.enddate = new Date(ev.detail.value)
    this.enddatepopover.dismiss()
  }

  milestoneChecked(event: any, goalid: number, index: number, milestone: Milestone) {
    if (event.detail.checked) {
      milestone.dateCompleted = this.goaldate
      milestone.isComplete = true
    } else {
      if (this.goaldate !== milestone.dateCompleted!) {
        console.warn("uncheck achieved milestone?")
        // update habitgrid for other date
        this.habitgriddocstore.habitMatrix().forEach(matchdata => {
          if (matchdata[0] === this.helperService.format(new Date(milestone.dateCompleted!))) {
            console.log(matchdata)

            let newhabitgriddoc: HabitGriddoc = new HabitGriddoc()
            let newhabitgrid: HabitGrid = new HabitGrid()
            newhabitgriddoc.id = matchdata[2]
            newhabitgrid.date = matchdata[0]
            newhabitgrid.progress = matchdata[1]
            newhabitgrid.milestones = matchdata[3] - 1
            newhabitgriddoc.habitGrid = newhabitgrid
            this.habitgriddocstore.saveHabitGriddoc(newhabitgriddoc)
          }
        })
      }
      milestone.dateCompleted = undefined
      milestone.isComplete = false
    }

    let goaldoc = this.goaldocstore.goals().find(goal => goal.id == goalid)
    goaldoc?.goal?.milestones.splice(index, 1, milestone)
    this.milestoneAchievedCount = this.getMilestoneCount()
    this.updateHabitGrid(milestone.isComplete, milestone.dateCompleted!)
    this.goaldocstore.saveGoaldoc(goaldoc)
  }

  getMilestoneCount() {
    this.milestoneAchievedCount = 0 //reset count
    this.goaldocstore.goals().forEach(goal => {
      // console.log('milestone:', goal.goal?.milestones)
      goal.goal?.milestones.forEach(milestone => {
        if (milestone.dateCompleted) {
          if (this.helperService.format(new Date(milestone.dateCompleted!)) === this.helperService.format(this.goaldate) && milestone.isComplete === true)
            this.milestoneAchievedCount++
        }
      })
      console.log(this.milestoneAchievedCount)
    })
    return this.milestoneAchievedCount
  }

  async openMilestoneModal(roletype: string, goalid: number, milestone?: Milestone) {
    const modal = await this.modalCtrl.create({
      component: MilestoneModalComponent,
      componentProps: {
        role: roletype,
        goalid: goalid,
        milestoneprop: milestone
      },
      cssClass: "small-modal-nested",
      backdropDismiss: true,
      backdropBreakpoint: 0,
      presentingElement: await this.modalCtrl.getTop() // Get the top-most ion-modal
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log(data)

    if (data) {
      this.goal = data.goal
      console.log(data.goal)
      // this.updateHabitGrid(milestone?.isComplete!, milestone?.dateCompleted!)
      this.goaldocstore.saveGoaldoc(data)
    }
    this.milestoneslide?.closeOpened()
  }

  updateHabitGrid(isComplete: boolean, dateCompleted: Date) {
    let progress: number = 0

    progress = this.goalService.getProgressCount(this.goaldocstore.goals(), this.goaldate)
    let findDateInMatrix = this.habitgriddocstore.habitMatrix().find(matrix => matrix[0] === this.helperService.format(this.goaldate))

    if (findDateInMatrix) {
      // get habitgrid by current day
      this.habitgriddocstore.habitMatrix().forEach((habitmatrix) => {
        if (habitmatrix[0] === this.helperService.format(this.goaldate)) {
          // update progress
          let newhabitgriddoc: HabitGriddoc = new HabitGriddoc()
          let newhabitgrid: HabitGrid = new HabitGrid()
          newhabitgriddoc.id = habitmatrix[2]
          newhabitgrid.date = habitmatrix[0]
          newhabitgrid.progress = progress
          newhabitgrid.milestones = this.milestoneAchievedCount
          newhabitgriddoc.habitGrid = newhabitgrid
          this.habitgriddocstore.saveHabitGriddoc(newhabitgriddoc)
        }
      })
    } else {
      // console.log('date not found, creating new one')
      let newhabitgriddoc: HabitGriddoc = new HabitGriddoc()
      let newhabitgrid: HabitGrid = new HabitGrid()
      newhabitgrid.date = this.helperService.format(dateCompleted)
      newhabitgrid.progress = progress
      newhabitgrid.milestones = this.milestoneAchievedCount
      newhabitgriddoc.habitGrid = newhabitgrid
      this.habitgriddocstore.addHabitGriddoc(newhabitgriddoc) //adds date if it doesnt exist
    }

  }
  // isComplete(milestone: Milestone) {
  //   if (milestone.dateCompleted)
  //     return this.helperService.format( milestone.dateCompleted!) == this.helperService.format(this.day())
  //   else 
  //     return false
  // }
}
