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


  // rebuildHabitMatrix( year: string) {
  //   let start = new Date("01/01/" + year);
  //   let end = new Date("12/31/" + year);

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

  //     this.postHabitGriddoc(habitGridDoc).subscribe(() => { })
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
