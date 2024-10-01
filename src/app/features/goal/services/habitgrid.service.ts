import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError } from 'rxjs';

import { HabitGriddoc } from '../models/habitgriddoc'
import { ApiService } from '../../../api.service';
import { tapResponse } from '@ngrx/operators';
import { HelperService } from 'src/app/helper.service';

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
    console.log(this.matchdata)
    console.log(this.matchdata.length)

    let currentyear = new Date().getFullYear()
    const isLeapYear = (year: number) => new Date(year, 1, 29).getMonth() === 1;
    let numberOfDays = isLeapYear(currentyear) ? 366 : 365
    console.log(numberOfDays)

    for (let i = this.matchdata.length; i < numberOfDays; i++) {
      console.log('test', i)
      this.matchdata.push([]) //fill empty matrix days with empty array
    }

    return this.matchdata
  }

  // addMatrixDates(inputdate: string, year: number) {
  //   let start = new Date("09/21/" + year);
  //   let end = new Date("09/30/" + year);
  //   let loop = new Date(start);

  //   while (loop < end) {
  //     var newDate = loop.setDate(loop.getDate() + 1);
  //     loop = new Date(newDate);
  //     if (inputdate === this.helperService.format(loop))
  //       console.log(inputdate)
  //   }
  // }

  // initHabitGrid(year: string) {
  //   let start = new Date("09/30/" + '2024');
  //   let end = new Date("12/31/" + '2024');

  //   let loop = new Date(start);
  //   while (loop < end) {
  //     var newDate = loop.setDate(loop.getDate() + 1);
  //     loop = new Date(newDate);
  //     let habitGrid: HabitGrid = new HabitGrid()
  //     habitGrid.date = this.helperService.format(loop)
  //     // console.log(habitGrid.date)
  //     habitGrid.progress = 0
  //     let habitGridDoc: HabitGriddoc = new HabitGriddoc()
  //     habitGridDoc.habitGrid = habitGrid

  //     setTimeout(() => {
  //       this.postHabitGriddoc(habitGridDoc).subscribe(() => { })
  //     }, 1000)
  //   }
  // }

  getHabitGriddoc(): Observable<Array<HabitGriddoc>> {
    return this.http.get<Array<HabitGriddoc>>(this.apiService.server() + '/api/habitgrid', this.apiService.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
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
  }
}
