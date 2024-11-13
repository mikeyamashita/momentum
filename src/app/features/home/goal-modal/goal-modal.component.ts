import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons,
  IonAlert, IonDatetime, IonDatetimeButton, IonPopover, IonToast,
  IonItem, IonList, IonLabel, IonFab, IonModal, IonInput, ModalController
} from '@ionic/angular/standalone';
import { GoaldocStore } from '../../goal/stores/goaldoc.store';
import { Goal } from '../../goal/models/goal';
import { Goaldoc } from '../../goal/models/goaldoc';

@Component({
  selector: 'app-goal-modal',
  templateUrl: './goal-modal.component.html',
  styleUrls: ['./goal-modal.component.scss'],
  standalone: true,
  imports: [IonModal, IonLabel, IonList, IonItem, IonDatetime, IonDatetimeButton, IonToast,
    IonPopover, IonInput, IonButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent,
    IonFab, IonAlert, FormsModule]
})
export class GoalModalComponent implements OnInit {
  readonly goaldocstore = inject(GoaldocStore);

  @ViewChild('startdatepopover') startdatepopover!: IonPopover;
  @ViewChild('enddatepopover') enddatepopover!: IonPopover;

  // inputs
  role: string = ''
  goaldocprop: Goaldoc = new Goaldoc();
  goaldate: Date = new Date();

  // props
  goal: Goal = new Goal();
  goalid: number = 0;
  goaldoc: Goaldoc = new Goaldoc();
  isToastOpen: boolean = false;

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
    if (this.goaldocprop)
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

milestoneChecked(goalid: number, index: number, milestone: Milestone){
  if (milestone.isComplete) {
    milestone.dateCompleted = undefined
    milestone.isComplete = false
  } else {
    milestone.dateCompleted = this.day()
    milestone.isComplete = true;
  }

  let goaldoc = this.goaldocstore.goals().find(goal => goal.id == goalid)

  goaldoc?.goal?.milestones.splice(index, 1, milestone)
  console.log(goaldoc)

  this.update(milestone.isComplete)
  this.goaldocstore.saveGoaldoc(goaldoc)
}
  
  async openMilestoneModal(roletype: string, goalid: number, milestone ?: Milestone) {
  const modal = await this.modalCtrl.create({
    component: MilestoneModalComponent,
    componentProps: {
      role: roletype,
      goalid: goalid,
      milestoneprop: milestone
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

  if (data) {
    this.goal = data.goal
    this.update(milestone?.isComplete!)
    this.goaldocstore.saveGoaldoc(data)
  }
  this.milestoneslide?.closeOpened()
}

update(isComplete: boolean) {
  let progress
  if (isComplete)
    progress = 101
  else
    progress = this.goalService.getProgressCount(this.goaldocstore.goals(), this.day())

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
  // isComplete(milestone: Milestone) {
  //   if (milestone.dateCompleted)
  //     return this.helperService.format( milestone.dateCompleted!) == this.helperService.format(this.day())
  //   else 
  //     return false
  // }
}
