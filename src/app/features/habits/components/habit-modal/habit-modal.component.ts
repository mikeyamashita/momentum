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
import { HelperService } from 'src/app/services/helper.service';
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
  habittimetest: any;

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

  constructor(private modalCtrl: ModalController, public helperService: HelperService) {
  }

  ngOnInit() {
    this.goaldocstore.getGoalById(this.goalid)
    if (this.role === 'save') {
      if (this.habitprop) {
        this.habit = this.habitprop
        this.habitclone = JSON.stringify(this.habitprop) // non mutable clone for findIndex
      }
    }

    // this.habittimetest = this.helperService.formatDateTime(this.habit.time)!
    // console.log(this.habit.time)
    // console.log(this.habittimetest)
  }

  // formatTimeString(time:string){
  //   let datetime: Date = new Date()
  //   datetime.setTime(time)
  // }

  formatTimeZone(datetime: Date) {
    // Get the time zone set on the user's device
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(datetime)
    const zonedTime = DateTime.fromISO(datetime.toString(), { zone: userTimeZone });
    console.log(zonedTime.toString())
    return zonedTime.toString()
  }

  // Events
  selectTime(ev: any) {
    let datetime = ev.detail.value

    // console.log(datetime)




    this.habit.time = this.formatTimeZone(datetime);
    this.habittimepopover.dismiss()
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