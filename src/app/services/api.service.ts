import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, isDevMode, signal } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public server = signal('')
  public isStaging = signal(false)

  constructor() { }

  public setEnvironment() {
    if (isDevMode())
      this.server.set('http://192.168.50.179:8001') //staging docker
    else
      this.server.set('https://momentum-api-axhfdmgbf2bjhjcu.canadacentral-01.azurewebsites.net') //prod azure
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  public handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
