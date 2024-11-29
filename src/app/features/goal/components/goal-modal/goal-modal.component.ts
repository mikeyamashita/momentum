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

  // isComplete(milestone: Milestone) {
  //   if (milestone.dateCompleted)
  //     return this.helperService.format( milestone.dateCompleted!) == this.helperService.format(this.day())
  //   else 
  //     return false
  // }
}
