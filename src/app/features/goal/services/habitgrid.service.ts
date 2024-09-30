import { Injectable, signal } from '@angular/core';
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
    return this.matchdata
  }

  getHabitGridByDate(date: string): Observable<HabitGrid> {
    return this.http.get<HabitGrid>(this.apiService.server() + '/api/habitgrid/' + date, this.apiService.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

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
            console.log(habitgriddoc)
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
          next: (res) => { console.log(res) },
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
