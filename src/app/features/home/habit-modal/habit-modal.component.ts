import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonAlert,
  IonItem, IonList, IonLabel, IonFab, IonModal, IonInput, ModalController
} from '@ionic/angular/standalone';
import { GoaldocStore } from '../../goal/stores/goaldoc.store';
import { Goal } from '../../goal/models/goal';
import { Habit } from '../../goal/models/habit';
import { Goaldoc } from '../../goal/models/goaldoc';

@Component({
  selector: 'app-habit-modal',
  templateUrl: './habit-modal.component.html',
  styleUrls: ['./habit-modal.component.scss'],
  standalone: true,
  imports: [IonModal, IonLabel, IonList, IonItem,
    IonInput, IonAlert,
    IonButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent,
    IonFab, FormsModule]
})
export class HabitModalComponent implements OnInit {
  readonly goaldocstore = inject(GoaldocStore);

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
  constructor(private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.goaldocstore.getGoalById(this.goalid)
    if (this.role === 'save') {
      if (this.habitprop) {
        this.habit = this.habitprop
        this.habitclone = JSON.stringify(this.habitprop) // non mutable clone for findIndex
      }
    }
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