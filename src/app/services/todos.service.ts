import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Todos } from '../model/todos';


@Injectable({
  providedIn: 'root'
})
export class TodosService {

  /**
   * @todoUrl variable stores the api endpoint
   */
  todosUrl = 'https://jsonplaceholder.typicode.com/todos';

  /**
   * Header Options
   */
  httpOptions = {
    headers: new HttpHeaders({
      'content-type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }
  /**
   * This is the method for handling all possible errors
   */
  errorHandling(error: HttpErrorResponse) {
  
    if(error.error instanceof ErrorEvent) {
      console.error('An error occured: ', error.error.message);
    }
    else {
      console.error(`Api returned code ${error.status}, and body: ${error}`);
    }
    return throwError ('Some went wrong, please try again later.');
  }

  /**
   * fetching todos from the api
   */
  getTodos(): Observable<Todos[]> {
    return this.http.get<Todos[]>(this.todosUrl).pipe(
      map((el) => el.slice(0, 10)),
      catchError(this.errorHandling)
    );
  }
}


