import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError } from 'rxjs';

import { HabitGriddoc } from '../models/habitgriddoc'
import { ApiService } from '../../../api.service';
import { tapResponse } from '@ngrx/operators';

@Injectable({
  providedIn: 'root'
})
export class HabitGridService {

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) {
    this.apiService.setEnvironment()
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
    return this.http.put<HabitGriddoc>(this.apiService.server() + '/api/habitgrid' + habitgriddoc.id, habitgriddoc, this.apiService.httpOptions)
      .pipe(
        tapResponse({
          next: () => { },
          error: catchError(this.apiService.handleError),
          finalize: () => {
          }
        }),
      );
  }

  deleteHabitGriddoc(id: number): Observable<unknown> {
    return this.http.delete(this.apiService.server() + '/api/habitgrid' + id, this.apiService.httpOptions)
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
