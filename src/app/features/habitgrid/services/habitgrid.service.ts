import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, concatMap, lastValueFrom } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { HabitGrid } from '../../habitgrid/models/habitgrid';
import { HabitGriddoc } from '../../habitgrid/models/habitgriddoc'

import { ApiService } from '../../../services/api.service';
import { DateService } from 'src/app/services/date.service';
import { Goaldoc } from '../../goal/models/goaldoc';

@Injectable({
  providedIn: 'root'
})
export class HabitGridService {

  matchdata: any = []

  constructor(private http: HttpClient, private apiService: ApiService, private dateService: DateService) {
    this.apiService.setEnvironment()
  }

  buildHabitMatrix(habitgriddoc: Array<HabitGriddoc>) {
    this.matchdata = new Array<any>()
    habitgriddoc?.forEach((habitgriddoc: HabitGriddoc) => {
      this.matchdata.push([habitgriddoc.habitGrid?.date, habitgriddoc.habitGrid?.progress, habitgriddoc.id, habitgriddoc.habitGrid?.milestones])
    });

    let currentyear = new Date().getFullYear()
    const isLeapYear = (year: number) => new Date(year, 1, 29).getMonth() === 1;
    let numberOfDays = isLeapYear(currentyear) ? 366 : 365

    if (this.matchdata.length < numberOfDays) {
      this.handleMissingDates(currentyear)
    }
    console.log(this.matchdata)
    return this.matchdata
  }

  handleMissingDates(year: number) {
    let start = new Date("01/01/" + year);
    let end = new Date("12/31/" + year);
    let i = 0
    let loop = new Date(start);

    while (loop < end) {
      if (this.matchdata[i]) {
        if (this.dateService.format(loop) !== this.matchdata[i][0]) {
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
    //   let habitgriddocs: Array<HabitGriddoc>
    //   if (!localStorage.getItem('habitgriddocs')) {
    //     habitgriddocs = this.buildNewHabitMatrix(new Date().getFullYear())
    //   } else {
    //     habitgriddocs = JSON.parse(localStorage.getItem('habitgriddocs')!);
    //   }
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
          next: (habitgriddoc: HabitGriddoc) => { },
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


    //   const deleteHabitGriddoc = new Observable((observer: { next: () => void; complete: () => void; }) => {
    //     let habitgriddocs: Array<any> = JSON.parse(localStorage.getItem('habitgriddocs')!)
    //     let findindex = habitgriddocs.findIndex((findhabitgriddoc: HabitGriddoc) => findhabitgriddoc.id === id)
    //     habitgriddocs.splice(findindex, 1)
    //     localStorage.setItem("habitgriddocs", JSON.stringify(habitgriddocs))
    //     observer.next()
    //     observer.complete()
    //   })
    //   return deleteHabitGriddoc
  }

  buildNewHabitGridDoc(year: number): Array<HabitGriddoc> {
    let start = new Date("01/01/" + year);
    let end = new Date("12/31/" + year);

    let habitGridDocs = Array<HabitGriddoc>();
    let loop = new Date(start);
    while (loop < end) {
      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
      let habitGrid: HabitGrid = new HabitGrid();
      habitGrid.date = this.dateService.format(loop);
      let habitGridDoc: HabitGriddoc = new HabitGriddoc();
      habitGridDoc.habitGrid = habitGrid;
      habitGridDocs.push(habitGridDoc);
    }
    // localStorage.setItem('habitgriddocs', JSON.stringify(habitGridDocs));

    console.log(habitGridDocs);
    return habitGridDocs;
  }

  rebuildHabitMatrix(goals: Array<Goaldoc>, year: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      let start = new Date("01/01/" + year);
      let end = new Date("12/31/" + year);

      let loop = new Date(start);
      while (loop < end) {
        var newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);
        let habitGrid: HabitGrid = new HabitGrid()
        habitGrid.date = this.dateService.format(loop)
        let progress = this.rebuildProgressCount(goals, loop)
        habitGrid.progress = progress
        let habitGridDoc: HabitGriddoc = new HabitGriddoc()
        habitGridDoc.habitGrid = habitGrid

        const $source = this.postHabitGriddoc(habitGridDoc);
        await lastValueFrom($source);
      }
      resolve(true)
    })
  }

  rebuildProgressCount(goaldoc: Array<Goaldoc>, date: Date): number {
    let count = 0
    let numHabits = 0

    goaldoc?.forEach(goaldoc => {
      goaldoc.goal?.habits?.forEach(habit => {
        if (habit.datesCompleted?.some((item) => item == this.dateService.format(date)))
          count++
        if (date >= new Date(goaldoc.goal?.startdate!) && date <= new Date(goaldoc.goal?.enddate!))
          numHabits++
      })
    })

    if (numHabits > 1)
      return Math.round(count / numHabits * 100)
    else
      return 0
  }
}
