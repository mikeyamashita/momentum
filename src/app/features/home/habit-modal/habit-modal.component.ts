import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { OverlayEventDetail } from '@ionic/core/components';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons,
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
    IonInput,
    IonButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent,
    IonFab, FormsModule]
})
export class HabitModalComponent implements OnInit {
  goalid: number = 0;
  goaldoc: Goaldoc = new Goaldoc();
  goal: Goal = new Goal();
  newHabit: Habit = new Habit();
  readonly goaldocstore = inject(GoaldocStore);

  constructor(private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.goaldocstore.getGoalId(this.goalid)
  }

  cancelHabitModal() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  addNewHabit() {
    return this.modalCtrl.dismiss(null, 'saveHabit');
  }

  // onWillDismiss(event: Event) {
  //   const ev = event as CustomEvent<OverlayEventDetail<Habit>>;
  //   console.log(ev.detail.role)
  //   // if (ev.detail.role === 'saveHabit') {
  //   //   this.goaldocstore.addGoaldoc(this.goaldoc)
  //   // }
  // }
}
