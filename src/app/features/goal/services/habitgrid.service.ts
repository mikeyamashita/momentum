import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError } from 'rxjs';

import { HabitGriddoc } from '../models/habitgriddoc'
import { ApiService } from '../../../api.service';
import { tapResponse } from '@ngrx/operators';
import { HelperService } from 'src/app/helper.service';
import { HabitGrid } from '../models/habitgrid';

@Injectable({
  providedIn: 'root'
})
export class HabitGridService {

  matchdata: any = []

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService, private helperService: HelperService) {
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
    // return this.http.get<Array<HabitGriddoc>>(this.apiService.server() + '/api/habitgrid', this.apiService.httpOptions)
    //   .pipe(
    //     catchError(this.apiService.handleError)
    //   );


    const getHabitGriddoc = new Observable((observer: { next: (arg0: Array<HabitGriddoc>) => void; complete: () => void; }) => {
      if (!localStorage.getItem('habitgriddocs')) {
        localStorage.setItem('habitgriddocs', '[]');
        console.log(localStorage.getItem('habitgriddocs'))
        this.rebuildHabitMatrix(new Date().getFullYear())
      }
      let habitgriddocs: Array<any> = JSON.parse(localStorage.getItem('habitgriddocs')!);
      observer.next(habitgriddocs);
      observer.complete()
    })
    return getHabitGriddoc
  }

  postHabitGriddoc(habitgriddoc: HabitGriddoc): Observable<HabitGriddoc> {
    // return this.http.post<HabitGriddoc>(this.apiService.server() + '/api/habitgrid', habitgriddoc, this.apiService.httpOptions)
    //   .pipe(
    //     tapResponse({
    //       next: (habitgriddoc: HabitGriddoc) => {
    //       },
    //       error: catchError(this.apiService.handleError),
    //       finalize: () => {
    //       }
    //     }),
    //   );


    const addHabitGriddoc = new Observable((observer: { next: (input: HabitGriddoc) => void; complete: () => void; }) => {
      let habitgriddocs: Array<any> = JSON.parse(localStorage.getItem('habitgriddocs')!)
      let maxId = 0
      habitgriddocs.forEach(habitgriddocfind => {
        if (habitgriddocfind.id > maxId)
          maxId = habitgriddocfind.id
      })
      habitgriddoc.id = maxId + 1001
      habitgriddocs.push(habitgriddoc)
      localStorage.setItem("habitgriddocs", JSON.stringify(habitgriddocs))
      observer.next(habitgriddoc)
      observer.complete()
    })
    return addHabitGriddoc
  }

  putHabitGriddoc(habitgriddoc: HabitGriddoc): Observable<HabitGriddoc> {
    // return this.http.put<HabitGriddoc>(this.apiService.server() + '/api/habitgrid/' + habitgriddoc.id, habitgriddoc, this.apiService.httpOptions)
    //   .pipe(
    //     tapResponse({
    //       next: (res) => { },
    //       error: catchError(this.apiService.handleError),
    //       finalize: () => {
    //       }
    //     }),
    //   );

    const saveHabitGriddoc = new Observable((observer: { next: (input: HabitGriddoc) => void; complete: () => void; }) => {
      let habitgriddocs: Array<any> = JSON.parse(localStorage.getItem('habitgriddocs')!)
      let findindex = habitgriddocs.findIndex((findhabitgriddoc: HabitGriddoc) => findhabitgriddoc.id === habitgriddoc.id)
      habitgriddocs.splice(findindex, 1, habitgriddoc)
      localStorage.setItem("habitgriddocs", JSON.stringify(habitgriddocs))
      observer.next(habitgriddoc)
      observer.complete()
    })
    return saveHabitGriddoc
  }

  deleteHabitGriddoc(id: number): Observable<unknown> {
    // return this.http.delete(this.apiService.server() + '/api/habitgrid/' + id, this.apiService.httpOptions)
    //   .pipe(
    //     tapResponse({
    //       next: () => { },
    //       error: catchError(this.apiService.handleError),
    //       finalize: () => {
    //       }
    //     }),
    //   );


    const deleteHabitGriddoc = new Observable((observer: { next: () => void; complete: () => void; }) => {
      let habitgriddocs: Array<any> = JSON.parse(localStorage.getItem('habitgriddocs')!)
      let findindex = habitgriddocs.findIndex((findhabitgriddoc: HabitGriddoc) => findhabitgriddoc.id === id)
      habitgriddocs.splice(findindex, 1)
      localStorage.setItem("habitgriddocs", JSON.stringify(habitgriddocs))
      observer.next()
      observer.complete()
    })
    return deleteHabitGriddoc
  }

  rebuildHabitMatrix(year: number) {
    let start = new Date("01/01/" + year);
    let end = new Date("12/31/" + year);

    let loop = new Date(start);
    while (loop < end) {
      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
      let habitGrid: HabitGrid = new HabitGrid()
      habitGrid.date = this.helperService.format(loop)
      // console.log(habitGrid.date)
      habitGrid.progress = 0
      let habitGridDoc: HabitGriddoc = new HabitGriddoc()
      habitGridDoc.habitGrid = habitGrid

      this.postHabitGriddoc(habitGridDoc).subscribe(() => { })
    }
  }
}
