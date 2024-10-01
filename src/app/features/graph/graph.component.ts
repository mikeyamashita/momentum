import { Component, OnInit, Input, inject } from '@angular/core';
import { HabitGriddocStore } from '../goal/stores/habitgriddoc.store';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  standalone: true,
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

  getColor(dia: number) {
    let x = dia
    if (x < 0 && x < 10)
      return this.colorLevel1;
    else if (x >= 10 && x < 20)
      return this.colorLevel2;
    else if (x >= 20 && x < 30)
      return this.colorLevel3;
    else if (x >= 30 && x < 40)
      return this.colorLevel4;
    else if (x >= 40 && x < 50)
      return this.colorLevel5;
    else if (x >= 50 && x < 60)
      return this.colorLevel6;
    else if (x >= 60 && x < 70)
      return this.colorLevel7;
    else if (x >= 70 && x < 80)
      return this.colorLevel8;
    else if (x >= 80 && x < 90)
      return this.colorLevel9;
    else if (x >= 90 && x <= 100)
      return this.colorLevel10;
    else if (x > 100)
      return this.colorMilestone;
    else
      return '#181818'
  }

}
