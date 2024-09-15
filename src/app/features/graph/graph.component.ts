// credit: https://github.com/SergioNoivak/ng-git-calendar
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  standalone: true,
})
export class GraphComponent implements OnInit {

  k = "l"

  @Input()
  year: string | undefined;
  @Input()
  match: any;

  @Input()
  colorLevel1: string | undefined;
  @Input()
  colorLevel2: string | undefined;
  @Input()
  colorLevel3: string | undefined;

  initialHeight: number | undefined;
  initialWidth: number | undefined;
  constanteHeight: number = 0;
  constanteWidth: number = 0;

  dias: any = []
  realMatch: any = {}
  constructor() { }

  dataAtualFormatada(data: Date) {
    var
      dia = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0' + dia : dia,
      mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0' + mes : mes,
      anoF = data.getFullYear();

    return mesF + "/" + diaF + "/" + anoF;
  }

  ngOnInit() {
    this.initialHeight = window.screen.height;
    this.initialWidth = window.screen.width;

    for (let i = 0; i < this.match.length; i++) {
      // console.log((new Date("" + this.match[i][0])).toDateString())
      // console.log(this.match[i][1])
      this.realMatch[(new Date("" + this.match[i][0])).toDateString()] = this.match[i][1]
    }

    let start = new Date("01/01/" + (this.year));
    let end = new Date("12/31/" + (this.year));

    // let listaDiv: HTMLElement = document.getElementById('squares')
    let loop = new Date(start);
    while (loop <= end) {
      let stringData = this.dataAtualFormatada(loop)

      console.log(this.dias)
      if (this.realMatch[loop.toDateString()] == undefined) {
        this.dias.push({ stringData: stringData, "data-level": 0 })
      }
      else {
        this.dias.push({ stringData: stringData, "data-level": parseInt(this.realMatch[loop.toDateString()]) })
      }

      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
  }

  onResize(event: any): void {
    if (this.initialHeight)
      this.constanteHeight = event.target.innerHeight / this.initialHeight;
    if (this.initialWidth)
      this.constanteWidth = event.target.innerWidth / this.initialWidth;
  }

  getColor(dia: { [x: string]: any; }) {
    switch (dia['data-level']) {
      case 1:
        return this.colorLevel1;
        break;
      case 2:
        return this.colorLevel2;
        break;
      case 3:
        return this.colorLevel3;
        break;
      default:
        return ''
    }
  }

}
