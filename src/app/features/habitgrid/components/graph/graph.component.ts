import { Component, Input, inject } from '@angular/core';
import { HabitGriddocStore } from '../../stores/habitgriddoc.store';
import {
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  standalone: true,
  imports: [IonIcon]
})
export class GraphComponent {
  readonly habitgriddocstore = inject(HabitGriddocStore);

  @Input()
  year: string | undefined;

  @Input()
  colorLevel1: string | undefined;
  @Input()
  colorLevel2: string | undefined;
  @Input()
  colorLevel3: string | undefined;
  @Input()
  colorLevel4: string | undefined;
  @Input()
  colorLevel5: string | undefined;
  @Input()
  colorLevel6: string | undefined;
  @Input()
  colorLevel7: string | undefined;
  @Input()
  colorLevel8: string | undefined;
  @Input()
  colorLevel9: string | undefined;
  @Input()
  colorLevel10: string | undefined;
  @Input()
  colorMilestone: string | undefined;


  constructor() {
  }

  // Lifecycle
  ionViewDidEnter() {
  }

  getColor(progress: number) {
    if (progress < 0 && progress < 10)
      return this.colorLevel1;
    else if (progress >= 10 && progress < 20)
      return this.colorLevel2;
    else if (progress >= 20 && progress < 30)
      return this.colorLevel3;
    else if (progress >= 30 && progress < 40)
      return this.colorLevel4;
    else if (progress >= 40 && progress < 50)
      return this.colorLevel5;
    else if (progress >= 50 && progress < 60)
      return this.colorLevel6;
    else if (progress >= 60 && progress < 70)
      return this.colorLevel7;
    else if (progress >= 70 && progress < 80)
      return this.colorLevel8;
    else if (progress >= 80 && progress < 90)
      return this.colorLevel9;
    else if (progress >= 90 && progress <= 100)
      return this.colorLevel10;
    else if (progress > 100)
      return this.colorMilestone;
    else
      return '#181818'
  }

  isMilestoneAchieved(milestoneCount: number): boolean {
    if (milestoneCount! > 0)
      return true
    else
      return false
  }

}
