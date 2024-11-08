import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { HabitGrid } from '../models/habitgrid';
import { HabitGriddoc } from '../models/habitgriddoc'

import { GoaldocStore } from '../stores/goaldoc.store';
import { ApiService } from '../../../api.service';
import { HelperService } from 'src/app/helper.service';
import { GoalService } from './goal.service';
import { Goaldoc } from '../models/goaldoc';

@Injectable({
  providedIn: 'root'
})
export class HabitGridService {

  matchdata: any = []

  constructor(private http: HttpClient, private apiService: ApiService, private helperService: HelperService) {
    this.apiService.setEnvironment()
  }

  buildHabitMatrix(habitgriddoc: Array<HabitGriddoc>) {
    this.matchdata = new Array<any>()
    habitgriddoc?.forEach((habitgriddoc: HabitGriddoc) => {
      this.matchdata.push([habitgriddoc.habitGrid?.date, habitgriddoc.habitGrid?.progress, habitgriddoc.id])
    });

    let currentyear = new Date().getFullYear()
    const isLeapYear = (year: number) => new Date(year, 1, 29).getMonth() === 1;
    let numberOfDays = isLeapYear(currentyear) ? 366 : 365

    if (this.matchdata.length < numberOfDays) {
      this.handleMissingDates(currentyear)
    }
    // console.log(this.matchdata)
    return this.matchdata
  }

  handleMissingDates(year: number) {
    let start = new Date("01/01/" + year);
    let end = new Date("12/31/" + year);
    let i = 0
    let loop = new Date(start);

    while (loop < end) {
      if (this.matchdata[i]) {
        if (this.helperService.format(loop) !== this.matchdata[i][0]) {
          this.matchdata.splice(i, 0, [])// replace missing dates with empty array 
        }
      }

      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
      i++
    }
  }

  getHabitGriddoc(): Observable<Array<HabitGriddoc>> {
    return this.http.get<Array<HabitGriddoc>>(this.apiService.server() + '/api/habitgrid', this.apiService.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );

    // const getHabitGriddoc = new Observable((observer: { next: (arg0: Array<HabitGriddoc>) => void; complete: () => void; }) => {
    //   if (!localStorage.getItem('habitgriddocs')) {
    //     localStorage.setItem('habitgriddocs', '[]');
    //     this.rebuildHabitMatrix(new Date().getFullYear())
    //   }
    //   let habitgriddocs: Array<any> = JSON.parse(localStorage.getItem('habitgriddocs')!);
    //   observer.next(habitgriddocs);
    //   observer.complete()
    // })
    // return getHabitGriddoc
  }

  postHabitGriddoc(habitgriddoc: HabitGriddoc): Observable<HabitGriddoc> {
    return this.http.post<HabitGriddoc>(this.apiService.server() + '/api/habitgrid', habitgriddoc, this.apiService.httpOptions)
      .pipe(
        tapResponse({
          next: (habitgriddoc: HabitGriddoc) => {
          },
          error: catchError(this.apiService.handleError),
          finalize: () => {
          }
        }),
      );


    // const addHabitGriddoc = new Observable((observer: { next: (input: HabitGriddoc) => void; complete: () => void; }) => {
    //   let habitgriddocs: Array<any> = JSON.parse(localStorage.getItem('habitgriddocs')!)
    //   let maxId = 0
    //   habitgriddocs.forEach(habitgriddocfind => {
    //     if (habitgriddocfind.id > maxId)
    //       maxId = habitgriddocfind.id
    //   })
    //   habitgriddoc.id = maxId + 1001
    //   habitgriddocs.push(habitgriddoc)
    //   localStorage.setItem("habitgriddocs", JSON.stringify(habitgriddocs))
    //   observer.next(habitgriddoc)
    //   observer.complete()
    // })
    // return addHabitGriddoc
  }

  putHabitGriddoc(habitgriddoc: HabitGriddoc): Observable<HabitGriddoc> {
    return this.http.put<HabitGriddoc>(this.apiService.server() + '/api/habitgrid/' + habitgriddoc.id, habitgriddoc, this.apiService.httpOptions)
      .pipe(
        tapResponse({
          next: (res) => { },
          error: catchError(this.apiService.handleError),
          finalize: () => {
          }
        }),
      );

    // const saveHabitGriddoc = new Observable((observer: { next: (input: HabitGriddoc) => void; complete: () => void; }) => {
    //   let habitgriddocs: Array<any> = JSON.parse(localStorage.getItem('habitgriddocs')!)
    //   let findindex = habitgriddocs.findIndex((findhabitgriddoc: HabitGriddoc) => findhabitgriddoc.id === habitgriddoc.id)
    //   habitgriddocs.splice(findindex, 1, habitgriddoc)
    //   localStorage.setItem("habitgriddocs", JSON.stringify(habitgriddocs))
    //   observer.next(habitgriddoc)
    //   observer.complete()
    // })
    // return saveHabitGriddoc
  }

  deleteHabitGriddoc(id: number): Observable<unknown> {
    return this.http.delete(this.apiService.server() + '/api/habitgrid/' + id, this.apiService.httpOptions)
      .pipe(
        tapResponse({
          next: () => { },
          error: catchError(this.apiService.handleError),
          finalize: () => {
          }
        }),
      );


    // const deleteHabitGriddoc = new Observable((observer: { next: () => void; complete: () => void; }) => {
    //   let habitgriddocs: Array<any> = JSON.parse(localStorage.getItem('habitgriddocs')!)
    //   let findindex = habitgriddocs.findIndex((findhabitgriddoc: HabitGriddoc) => findhabitgriddoc.id === id)
    //   habitgriddocs.splice(findindex, 1)
    //   localStorage.setItem("habitgriddocs", JSON.stringify(habitgriddocs))
    //   observer.next()
    //   observer.complete()
    // })
    // return deleteHabitGriddoc
  }

  rebuildHabitMatrix(goals: Array<Goaldoc>, year: number) {
    let start = new Date("01/01/" + year);
    let end = new Date("12/31/" + year);

    let loop = new Date(start);
    while (loop < end) {
      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
      let habitGrid: HabitGrid = new HabitGrid()
      habitGrid.date = this.helperService.format(loop)
      let progress = this.rebuildProgressCount(goals, loop)
      habitGrid.progress = progress
      let habitGridDoc: HabitGriddoc = new HabitGriddoc()
      habitGridDoc.habitGrid = habitGrid

      this.postHabitGriddoc(habitGridDoc).subscribe(() => { })
    }
  }

  rebuildProgressCount(goaldoc: Array<Goaldoc>, date: Date): number {
    let count = 0
    let numHabits = 0

    goaldoc?.forEach(goaldoc => {
      goaldoc.goal?.habits?.forEach(habit => {
        if (habit.datesCompleted?.some((item) => item == this.helperService.format(date)))
          count++
        if (date >= new Date(goaldoc.goal?.startdate!) && date <= new Date(goaldoc.goal?.enddate!))
          numHabits++
      })
    })

    // let habitGrid: HabitGrid = new HabitGrid()
    // habitGrid.date = this.helperService.format(date)
    // habitGrid.progress = Math.round(count / numHabits * 100)
    // let habitGridDoc: HabitGriddoc = new HabitGriddoc()
    // habitGridDoc.habitGrid = habitGrid
    console.log(count)
    console.log(numHabits)
    console.log(Math.round(count / numHabits * 100))
    if (numHabits > 1)
      return Math.round(count / numHabits * 100)
    else
      return 0
  }
}
