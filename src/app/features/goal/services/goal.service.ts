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
        console.log(goaldoc)
        if (date >= new Date(goaldoc.goal?.startdate!) && date <= new Date(goaldoc.goal?.enddate!))
          numHabits++
      })
    })

    let habitGrid: HabitGrid = new HabitGrid()
    habitGrid.date = this.helperService.format(date)
    habitGrid.progress = Math.round(count / numHabits * 100)
    let habitGridDoc: HabitGriddoc = new HabitGriddoc()
    habitGridDoc.habitGrid = habitGrid
    console.log(count)
    console.log(numHabits)
    console.log(Math.round(count / numHabits * 100))
    return Math.round(count / numHabits * 100)
  }

  getGoalById(id: number): Observable<Goaldoc> {
    // return this.http.get<Goaldoc>(this.apiService.server() + '/api/goal/' + id, this.apiService.httpOptions)
    //   .pipe(
    //     catchError(this.apiService.handleError)
    //   );


    const getGoalById = new Observable((observer: { next: (input: Goaldoc) => void; complete: () => void; }) => {
      let goaldocs: Array<any> = JSON.parse(localStorage.getItem('goaldocs')!)
      let findgoaldoc = goaldocs.find((findgoaldoc: Goaldoc) => findgoaldoc.id === id)

      observer.next(findgoaldoc)
      observer.complete()
    })
    return getGoalById
  }

  getGoals(): Observable<Array<Goaldoc>> {
    // return this.http.get<Array<Goaldoc>>(this.apiService.server() + '/api/goals', this.apiService.httpOptions)
    //   .pipe(
    //     catchError(this.apiService.handleError)
    //   );

    const getGoals = new Observable((observer: { next: (input: Array<Goaldoc>) => void; complete: () => void; }) => {
      if (!localStorage.getItem('goaldocs')) {
        localStorage.setItem('goaldocs', '[]')
      }
      let goaldocs: Array<any> = JSON.parse(localStorage.getItem('goaldocs')!)
      observer.next(goaldocs)
      observer.complete()
    })
    return getGoals
  }

  postGoaldoc(goaldoc: Goaldoc): Observable<Goaldoc> {
    // return this.http.post<Goaldoc>(this.apiService.server() + '/api/goal', goaldoc, this.apiService.httpOptions)
    //   .pipe(
    //     tapResponse({
    //       next: () => { },
    //       error: catchError(this.apiService.handleError),
    //       finalize: () => {
    //       }
    //     }),
    //   );

    const addGoal = new Observable((observer: { next: (input: Goaldoc) => void; complete: () => void; }) => {
      let goaldocs: Array<any> = JSON.parse(localStorage.getItem('goaldocs')!)
      let maxId = 0
      goaldocs.forEach(goaldocfind => {
        if (goaldocfind.id > maxId)
          maxId = goaldocfind.id
      })
      goaldoc.id = maxId + 1001
      goaldocs.push(goaldoc)
      localStorage.setItem("goaldocs", JSON.stringify(goaldocs))
      observer.next(goaldoc)
      observer.complete()
    })
    return addGoal
  }

  putGoaldoc(goaldoc: Goaldoc): Observable<Goaldoc> {
    // return this.http.put<Goaldoc>(this.apiService.server() + '/api/goal/' + goaldoc.id, goaldoc, this.apiService.httpOptions)
    //   .pipe(
    //     tapResponse({
    //       next: () => { },
    //       error: catchError(this.apiService.handleError),
    //       finalize: () => {
    //       }
    //     }),
    //   );

    const saveGoal = new Observable((observer: { next: (input: Goaldoc) => void; complete: () => void; }) => {
      let goaldocs: Array<any> = JSON.parse(localStorage.getItem('goaldocs')!)
      let findindex = goaldocs.findIndex((findgoaldoc: Goaldoc) => findgoaldoc.id === goaldoc.id)
      goaldocs.splice(findindex, 1, goaldoc)
      localStorage.setItem("goaldocs", JSON.stringify(goaldocs))
      observer.next(goaldoc)
      observer.complete()
    })
    return saveGoal
  }

  deleteGoaldoc(id: number): Observable<unknown> {
    // return this.http.delete(this.apiService.server() + '/api/goal/' + id, this.apiService.httpOptions)
    //   .pipe(
    //     tapResponse({
    //       next: () => { },
    //       error: catchError(this.apiService.handleError),
    //       finalize: () => {
    //       }
    //     }),
    //   );    

    const deleteGoal = new Observable((observer: { next: () => void; complete: () => void; }) => {
      let goaldocs: Array<any> = JSON.parse(localStorage.getItem('goaldocs')!)
      let findindex = goaldocs.findIndex((findgoaldoc: Goaldoc) => findgoaldoc.id === id)
      goaldocs.splice(findindex, 1)
      localStorage.setItem("goaldocs", JSON.stringify(goaldocs))
      observer.next()
      observer.complete()
    })
    return deleteGoal
  }
}
