import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private snackBar: MatSnackBar
    ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `An error occurred: ${error.error.message}`;
        } else {
          // Backend returned an unsuccessful response code
          errorMessage = `Backend returned code ${error.status}: ${error.message}`;
        }

        // Handle error logging here (e.g., sending logs to a server)

        console.error(error); // Log the error
        this.showNotification('snackbar-success', errorMessage, 'bottom', 'center');
        return throwError(errorMessage); // Pass the error message to the subscriber
      })
    );
  }
}
