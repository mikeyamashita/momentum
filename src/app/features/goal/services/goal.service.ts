import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

import { Goaldoc } from '../models/goaldoc'
import { ApiService } from '../../../api.service';
import { tapResponse } from '@ngrx/operators';
import { HabitGriddocStore } from '../stores/habitgriddoc.store';
import { HabitGrid } from '../models/habitgrid';
import { HabitGriddoc } from '../models/habitgriddoc';
import { HelperService } from 'src/app/helper.service';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  readonly habitgriddocstore = inject(HabitGriddocStore);
  matchdata: any = []

  constructor(private http: HttpClient, private apiService: ApiService, private helperService: HelperService) {
    this.apiService.setEnvironment()
  }

  getProgressCount(goaldoc: Array<Goaldoc>, date: Date): number {
    let count = 0
    let numHabits = 0

    goaldoc?.forEach(goaldoc => {
      goaldoc.goal?.habits?.forEach(habit => {
        if (habit.datesCompleted?.some((item) => item == this.helperService.format(date)))
          count++
        numHabits++
      })
    })

    let habitGrid: HabitGrid = new HabitGrid()
    habitGrid.date = this.helperService.format(date)
    habitGrid.progress = Math.round(count / numHabits * 100)
    let habitGridDoc: HabitGriddoc = new HabitGriddoc()
    habitGridDoc.habitGrid = habitGrid

    return Math.round(count / numHabits * 100)
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
