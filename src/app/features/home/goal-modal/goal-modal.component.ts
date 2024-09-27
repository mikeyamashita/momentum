import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons,
  IonItem, IonList, IonLabel, IonFab, IonModal, IonInput, ModalController
} from '@ionic/angular/standalone';
import { GoaldocStore } from '../../goal/stores/goaldoc.store';
import { Goal } from '../../goal/models/goal';
import { Habit } from '../../goal/models/habit';
import { Goaldoc } from '../../goal/models/goaldoc';

@Component({
  selector: 'app-goal-modal',
  templateUrl: './goal-modal.component.html',
  styleUrls: ['./goal-modal.component.scss'],
  standalone: true,
  imports: [IonModal, IonLabel, IonList, IonItem,
    IonInput, IonButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent,
    IonFab, FormsModule]
})
export class GoalModalComponent implements OnInit {
  readonly goaldocstore = inject(GoaldocStore);

  //inputs
  role: string = ''
  goaldocprop: Goaldoc = new Goaldoc();

  goal: Goal = new Goal();
  goalid: number = 0;
  goaldoc: Goaldoc = new Goaldoc();

  constructor(private modalCtrl: ModalController) {
  }

  ngOnInit() {
    if (this.goaldocprop)
      this.goal = this.goaldocprop.goal!
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

  deleteGoal() {
    return this.modalCtrl.dismiss(this.goaldocprop.id!, 'deleteGoal');
  }

}
