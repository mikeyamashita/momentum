import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';

import { Goaldoc } from '../models/goaldoc'
import { ApiService } from '../../../api.service';
import { tapResponse } from '@ngrx/operators';
import { HabitGridService } from './habitgrid.service';
import { HabitGrid } from '../models/habitgrid';
import { HabitGriddoc } from '../models/habitgriddoc';
import { HabitGriddocStore } from '../stores/habitgriddoc.store';
import { ISODateString } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  readonly habitgriddocstore = inject(HabitGriddocStore);
  matchdata: any = []

  constructor(private http: HttpClient, private apiService: ApiService, private habitGridService: HabitGridService) {
    this.apiService.setEnvironment()
  }

  format(data: Date) {
    var
      dia = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0' + dia : dia,
      mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0' + mes : mes,
      anoF = data.getFullYear();
    return mesF + "/" + diaF + "/" + anoF;
  }

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

    let habitGrid: HabitGrid = new HabitGrid()
    habitGrid.date = this.format(date)
    habitGrid.progress = Math.round(count / numHabits * 100)
    let habitGridDoc: HabitGriddoc = new HabitGriddoc()
    habitGridDoc.habitGrid = habitGrid
    console.log(habitGridDoc)

    //this.habitgriddocstore.addHabitGriddoc(habitGridDoc);

    return Math.round(count / numHabits * 100)
  }

  getProgress(goaldoc: Array<Goaldoc>, date?: string): Array<any> {
    this.matchdata = new Array<any>()
    let start = new Date("01/01/" + '2024');
    let end = new Date("12/31/" + '2024');

    let startdate = new Date(start);
    while (startdate <= end) {
      let thedate = this.format(startdate)
      this.matchdata.push([thedate, this.getProgressCount(goaldoc, startdate)])
      var newDate = startdate.setDate(startdate.getDate() + 1);
      startdate = new Date(newDate);
    }
    return this.matchdata
  }

  getProgressForDate(goaldoc: Array<Goaldoc>, date?: string) {
    this.habitGridService.getHabitGriddoc().subscribe(habitgriddoc => {
      habitgriddoc.forEach(habitgriddoc => {
        if (habitgriddoc.habitGrid?.date === date)
          console.log(habitgriddoc)
      })
    })
  }

  saveProgress(date: Date) {

  }

  getGoalById(id: number): Observable<Goaldoc> {
    return this.http.get<Goaldoc>(this.apiService.server() + '/api/goal/' + id, this.apiService.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
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
    return this.http.put<Goaldoc>(this.apiService.server() + '/api/goal' + goaldoc.id, goaldoc, this.apiService.httpOptions)
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
    return this.http.delete(this.apiService.server() + '/api/goal' + id, this.apiService.httpOptions)
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
