import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonAlert,
  IonDatetime, IonDatetimeButton,
  IonPopover,
  IonItem, IonLabel, IonInput, ModalController
} from '@ionic/angular/standalone';
import { GoaldocStore } from '../../../goal/stores/goaldoc.store';
import { Goal } from '../../../goal/models/goal';
import { Habit } from '../../../habits/models/habit';
import { Goaldoc } from '../../../goal/models/goaldoc';
import { DateService } from 'src/app/services/date.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-habit-modal',
  templateUrl: './habit-modal.component.html',
  styleUrls: ['./habit-modal.component.scss'],
  standalone: true,
  imports: [IonLabel, IonItem,
    IonInput, IonAlert, IonDatetime, IonDatetimeButton,
    IonPopover,
    IonButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent,
    FormsModule]
})
export class HabitModalComponent implements OnInit {
  readonly goaldocstore = inject(GoaldocStore);

  @ViewChild('habittimepopover') habittimepopover!: IonPopover;

  // inputs
  role: string = ''
  goalid: number = 0;
  habitprop: Habit = new Habit();

  // props
  goaldoc: Goaldoc = new Goaldoc();
  goal: Goal = new Goal();
  habit: Habit = new Habit();
  habitclone: any

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

  constructor(private modalCtrl: ModalController, public dateService: DateService) {

  }

  ngOnInit() {
    this.goaldocstore.getGoalById(this.goalid)
    if (this.role === 'save') {
      if (this.habitprop) {
        this.habit = this.habitprop
        this.habitclone = JSON.stringify(this.habitprop) // non mutable clone for findIndex
      }
    } else if (this.role === 'add') {
      this.habit.time = this.getZonedTime(new Date().toISOString())
    }
  }

  getZonedTime(datetime: any) {
    // Get the time zone set on the user's device
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedTime = DateTime.fromISO(datetime.toString(), { zone: userTimeZone });
    console.log(zonedTime.toString().split('T')[1]);
    return zonedTime.toString().split('T')[1]; //return only time and timezone
  }

  // Events
  selectTime(ev: any) {
    let datetime = ev.detail.value;
    console.log(datetime)
    this.habit.time = this.getZonedTime(datetime);
    this.habittimepopover.dismiss();
  }

  cancelHabitModal() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  saveHabit() {
    if (this.role === 'add') {
      this.goaldocstore.goal().goal?.habits?.push(this.habit)
    } else {
      let habitIndex = this.goaldocstore.goal().goal?.habits?.findIndex(habit => habit.name === JSON.parse(this.habitclone).name)
      this.goaldocstore.goal().goal?.habits?.splice(habitIndex!, 1, this.habit)
    }
    return this.modalCtrl.dismiss(this.goaldocstore.goal(), 'saveHabit')
  }

  deleteHabit(ev: any) {
    if (ev.detail.role === 'confirm') {
      let habitIndex = this.goaldocstore.goal().goal?.habits?.findIndex(habit => habit.name === JSON.parse(this.habitclone).name)
      this.goaldocstore.goal().goal?.habits?.splice(habitIndex!, 1)
      return this.modalCtrl.dismiss(this.goaldocstore.goal(), 'deleteHabit')
    } else
      return this.modalCtrl.dismiss(null, 'cancel');
  }
}