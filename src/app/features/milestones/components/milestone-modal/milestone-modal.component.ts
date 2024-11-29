import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonAlert,
  IonDatetime, IonDatetimeButton, IonToast,
  IonPopover,
  IonItem, IonList, IonLabel, IonFab, IonModal, IonInput, ModalController
} from '@ionic/angular/standalone';
import { GoaldocStore } from '../../../goal/stores/goaldoc.store';
import { Goal } from '../../../goal/models/goal';
import { Milestone } from '../../models/milestone';
import { Goaldoc } from '../../../goal/models/goaldoc';

@Component({
  selector: 'app-milestone-modal',
  templateUrl: './milestone-modal.component.html',
  styleUrls: ['./milestone-modal.component.scss'],
  standalone: true,
  imports: [IonLabel, IonItem,
    IonInput, IonAlert, IonDatetime, IonDatetimeButton,
    IonPopover,
    IonButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent,
    FormsModule]
})
export class MilestoneModalComponent implements OnInit {
  @ViewChild('forecastdatepopover') forecastdatepopover!: IonPopover;

  readonly goaldocstore = inject(GoaldocStore);

  // inputs
  role: string = ''
  goalid: number = 0;
  milestoneprop: Milestone = new Milestone();

  // props
  goaldoc: Goaldoc = new Goaldoc();
  goal: Goal = new Goal();
  milestone: Milestone = new Milestone();
  milestoneclone: any

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
    this.goaldocstore.getGoalById(this.goalid)
    if (this.role === 'save') {
      if (this.milestoneprop) {
        this.milestone = this.milestoneprop
        this.milestoneclone = JSON.stringify(this.milestoneprop) // non mutable clone for findIndex
      }
    }
  }

  selectForecastDate(ev: any) {
    console.log(ev.detail.value)
    this.milestone.forecastDate = new Date(ev.detail.value)
    this.forecastdatepopover.dismiss()
  }

  cancelMilestoneModal() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  saveMilestone() {
    if (this.role === 'add') {
      this.goaldocstore.goal().goal?.milestones?.push(this.milestone)
    } else {
      let milestoneIndex = this.goaldocstore.goal().goal?.milestones?.findIndex(milestone => milestone.name === JSON.parse(this.milestoneclone).name)
      this.goaldocstore.goal().goal?.milestones?.splice(milestoneIndex!, 1, this.milestone)
    }
    return this.modalCtrl.dismiss(this.goaldocstore.goal(), 'saveMilestone')
  }

  deleteMilestone(ev: any) {
    if (ev.detail.role === 'confirm') {
      let milestoneIndex = this.goaldocstore.goal().goal?.milestones?.findIndex(milestone => milestone.name === JSON.parse(this.milestoneclone).name)
      this.goaldocstore.goal().goal?.milestones?.splice(milestoneIndex!, 1)
      return this.modalCtrl.dismiss(this.goaldocstore.goal(), 'deleteMilestone')
    } else
      return this.modalCtrl.dismiss(null, 'cancel');
  }
}