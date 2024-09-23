import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError } from 'rxjs';

import { Goaldoc } from '../models/goaldoc'
import { ApiService } from '../../../api.service';
import { tapResponse } from '@ngrx/operators';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  matchdata: any = []

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) {
    this.apiService.setEnvironment()
  }

  // getGoaldocById(id: number): Observable<Goaldoc> {
  //   return this.http.get<Goaldoc>(this.apiService.server() + '/api/Goaldoc/' + id, this.apiService.httpOptions)
  //     .pipe(
  //       catchError(this.apiService.handleError)
  //     );
  // }

  format(data: Date) {
    var
      dia = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0' + dia : dia,
      mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0' + mes : mes,
      anoF = data.getFullYear();
    return mesF + "/" + diaF + "/" + anoF;
  }

  // getHabitCount(goaldoc: Array<Goaldoc>): number {
  //   let count = 0
  //   let dateMatrix = []
  //   goaldoc?.forEach(goaldoc => {
  //     goaldoc.goal?.habits?.forEach(habit => {
  //       if (habit.datesCompleted?.some((item) => item == this.format(new Date))) {
  //         count++
  //       }
  //     })
  //   })
  //   return count
  // }

  getProgressCount(goaldoc: Array<Goaldoc>, date: Date): number {
    let count = 0
    let numHabits = 0

    goaldoc?.forEach(goaldoc => {
      goaldoc.goal?.habits?.forEach(habit => {
        if (habit.datesCompleted?.some((item) => item == this.format(date)))
          count++
        numHabits++
      })
    })
    return Math.round(count / numHabits * 100)
  }

  getProgress(goaldoc: Array<Goaldoc>): Array<any> {
    this.matchdata = new Array<any>()
    let start = new Date("01/01/" + '2024');
    let end = new Date("12/31/" + '2024');

    let loop = new Date(start);
    while (loop <= end) {
      let stringData = this.format(loop)

      this.matchdata.push([stringData, this.getProgressCount(goaldoc, loop)])

      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
    // console.log(this.matchdata)
    return this.matchdata
  }

  getGoals(): Observable<Array<Goaldoc>> {
    return this.http.get<Array<Goaldoc>>(this.apiService.server() + '/api/goals', this.apiService.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

  postGoaldoc(goaldoc: Goaldoc): Observable<Goaldoc> {
    return this.http.post<Goaldoc>(this.apiService.server() + '/api/goal', goaldoc, this.apiService.httpOptions)
      .pipe(
        tapResponse({
          next: () => { },
          error: catchError(this.apiService.handleError),
          finalize: () => {
          }
        }),
      );
  }

  putGoaldoc(goaldoc: Goaldoc): Observable<Goaldoc> {
    return this.http.put<Goaldoc>(this.apiService.server() + '/api/goal/' + goaldoc.id, goaldoc, this.apiService.httpOptions)
      .pipe(
        tapResponse({
          next: () => { },
          error: catchError(this.apiService.handleError),
          finalize: () => {
          }
        }),
      );
  }

  deleteGoaldoc(id: number): Observable<unknown> {
    return this.http.delete(this.apiService.server() + '/api/goal/' + id, this.apiService.httpOptions)
      .pipe(
        tapResponse({
          next: () => { },
          error: catchError(this.apiService.handleError),
          finalize: () => {
          }
        }),
      );
  }

}
