import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError } from 'rxjs';

import { Goaldoc } from '../models/goaldoc'
import { ApiService } from '../../../api.service';
import { tapResponse } from '@ngrx/operators';
import { Goal } from '../models/goal';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) {
    this.apiService.setEnvironment()
  }

  // getGoaldocById(id: number): Observable<Goaldoc> {
  //   return this.http.get<Goaldoc>(this.apiService.server() + '/api/Goaldoc/' + id, this.apiService.httpOptions)
  //     .pipe(
  //       catchError(this.apiService.handleError)
  //     );
  // }

  getGoals(): Observable<Array<Goaldoc>> {
    return this.http.get<Array<Goaldoc>>(this.apiService.server() + '/api/goals', this.apiService.httpOptions)
      .pipe(
        catchError(this.apiService.handleError)
      );
  }

  // postGoaldoc(goaldoc: Goaldoc): Observable<Goaldoc> {
  //   return this.http.post<Goaldoc>(this.apiService.server() + '/api/Goaldoc', goaldoc, this.apiService.httpOptions)
  //     .pipe(
  //       tapResponse({
  //         next: () => { },
  //         error: catchError(this.apiService.handleError),
  //         finalize: () => {
  //         }
  //       }),
  //     );
  // }

  // putGoaldoc(goaldoc: Goaldoc): Observable<Goaldoc> {
  //   return this.http.put<Goaldoc>(this.apiService.server() + '/api/Goaldoc/' + goaldoc.id, goaldoc, this.apiService.httpOptions)
  //     .pipe(
  //       tapResponse({
  //         next: () => { },
  //         error: catchError(this.apiService.handleError),
  //         finalize: () => {
  //         }
  //       }),
  //     );
  // }

  // deleteGoaldoc(id: number): Observable<unknown> {
  //   return this.http.delete(this.apiService.server() + '/api/Goaldoc/' + id, this.apiService.httpOptions)
  //     .pipe(
  //       tapResponse({
  //         next: () => { },
  //         error: catchError(this.apiService.handleError),
  //         finalize: () => {
  //         }
  //       }),
  //     );
  // }

}
