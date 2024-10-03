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

  constructor(private modalCtrl: ModalController) {
  }

  ngOnInit() {
    if (this.goaldocprop)
      this.goal = this.goaldocprop.goal!
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
    this.goal.startdate = new Date(ev.detail.value)
    this.startdatepopover.dismiss()
  }

  selectEndDate(ev: any) {
    this.goal.enddate = new Date(ev.detail.value)
    this.enddatepopover.dismiss()
  }

}
