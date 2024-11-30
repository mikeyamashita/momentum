import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {

  IonContent, IonButton, IonIcon,
  IonPopover,
  IonItem, IonList, IonCheckbox,
  IonItemSliding, IonItemOptions, IonItemOption, ModalController, IonLabel, IonSegmentButton, IonSegment
} from '@ionic/angular/standalone';

import { GoaldocStore } from '../../../goal/stores/goaldoc.store';
import { Goal } from '../../../goal/models/goal';
import { Milestone } from '../../models/milestone';
import { Goaldoc } from '../../../goal/models/goaldoc';
import { MilestoneModalComponent } from '../milestone-modal/milestone-modal.component';
import { HabitGriddoc } from 'src/app/features/habitgrid/models/habitgriddoc';
import { HabitGrid } from 'src/app/features/habitgrid/models/habitgrid';
import { HabitGriddocStore } from 'src/app/features/habitgrid/stores/habitgriddoc.store';
import { HelperService } from 'src/app/services/helper.service';
import { GoalService } from 'src/app/features/goal/services/goal.service';

@Component({
  selector: 'app-milestone-list',
  templateUrl: './milestone-list.component.html',
  styleUrls: ['./milestone-list.component.scss'],
  standalone: true,
  imports: [IonSegment, IonSegmentButton, IonLabel,
    IonContent, IonButton, IonIcon,
    IonItem, IonList, IonCheckbox,
    IonItemSliding, IonItemOptions, IonItemOption
  ]
})
export class MilestoneListComponent implements OnInit {
  @ViewChild('forecastdatepopover') forecastdatepopover!: IonPopover;

  readonly goaldocstore = inject(GoaldocStore);
  readonly habitgriddocstore = inject(HabitGriddocStore);

  @ViewChild('milestoneslide') milestoneslide!: IonItemSliding;

  // inputs
  goaldocprop: Goaldoc = new Goaldoc();
  goaldate: Date = new Date();

  // props
  goal: Goal = new Goal();
  goalid: number = 0;
  goaldoc: Goaldoc = new Goaldoc();
  isToastOpen: boolean = false;
  milestoneAchievedCount: number = 0
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

  constructor(private modalCtrl: ModalController, public helperService: HelperService, private goalService: GoalService) {
  }

  ngOnInit() {
    this.goaldoc = this.goaldocprop;
  }

  selectForecastDate(ev: any) {
    console.log(ev.detail.value)
    this.milestone.forecastDate = new Date(ev.detail.value)
    this.forecastdatepopover.dismiss()
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

    // let goaldoc = this.goaldocstore.goals().find(goal => goal.id == goalid)
    this.goaldoc?.goal?.milestones.splice(index, 1, milestone)
    this.milestoneAchievedCount = this.getMilestoneCount()
    this.updateHabitGrid(milestone.isComplete, milestone.dateCompleted!)
    this.goaldocstore.saveGoaldoc(this.goaldoc)
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
      initialBreakpoint: 0.40,
      breakpoints: [0, 0.40, 1],
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

}