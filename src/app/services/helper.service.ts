import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  format(data: Date) {
    // console.log(data)
    var
      dia = data?.getDate().toString(),
      diaF = (dia.length == 1) ? '0' + dia : dia,
      mes = (data?.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0' + mes : mes,
      anoF = data?.getFullYear();
    return mesF + "/" + diaF + "/" + anoF;
  }
}
