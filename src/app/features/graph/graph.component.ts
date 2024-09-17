// credit: https://github.com/SergioNoivak/ng-git-calendar
import { Component, OnInit, Input, inject, signal } from '@angular/core';
import { HabitGrid } from '../goal/models/habitgrid';
import { GoaldocStore } from '../goal/stores/goaldoc.store';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  standalone: true,
})
export class GraphComponent implements OnInit {

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
  colorMilestone: string | undefined;

  initialHeight: number | undefined;
  initialWidth: number | undefined;
  constanteHeight: number = 0;
  constanteWidth: number = 0;

  readonly goaldocstore = inject(GoaldocStore);

  constructor() {
  }

  // Lifecycle
  ngOnInit() {
    this.initialHeight = window.screen.height;
    this.initialWidth = window.screen.width;
    // setTimeout(() => {
    // }, 500)
    // this.buildGrid();
  }

  ionViewDidEnter() {
  }

  // buildGrid() {
  //   for (let i = 0; i < this.match.length; i++) {
  //     this.realMatch[(new Date("" + this.match[i][0])).toDateString()] = this.match[i][1]
  //   }

  //   let start = new Date("01/01/" + (this.year));
  //   let end = new Date("12/31/" + (this.year));

  //   let loop = new Date(start);
  //   while (loop <= end) {
  //     let stringData = this.dataAtualFormatada(loop)

  //     if (this.realMatch[loop.toDateString()] == undefined) {
  //       this.squares().push({ stringData: stringData, "datalevel": 0 })
  //     } else {
  //       this.squares().push({ stringData: stringData, "datalevel": parseInt(this.realMatch[loop.toDateString()]) })
  //     }

  //     var newDate = loop.setDate(loop.getDate() + 1);
  //     loop = new Date(newDate);
  //   }
  // }

  // Methods
  // dataAtualFormatada(data: Date) {
  //   var
  //     dia = data.getDate().toString(),
  //     diaF = (dia.length == 1) ? '0' + dia : dia,
  //     mes = (data.getMonth() + 1).toString(),
  //     mesF = (mes.length == 1) ? '0' + mes : mes,
  //     anoF = data.getFullYear();

  //   return mesF + "/" + diaF + "/" + anoF;
  // }

  getColor(dia: number) {
    let x = dia
    if (x < 25 && x > 0)
      return this.colorLevel1;
    else if (x >= 25 && x < 50)
      return this.colorLevel2;
    else if (x >= 50 && x < 75)
      return this.colorLevel3;
    else if (x >= 75 && x < 100)
      return this.colorLevel4;
    else if (x >= 100)
      return this.colorMilestone;
    else
      return '#181818'
  }

  // Events
  onResize(event: any): void {
    if (this.initialHeight)
      this.constanteHeight = event.target.innerHeight / this.initialHeight;
    if (this.initialWidth)
      this.constanteWidth = event.target.innerWidth / this.initialWidth;
  }
}
