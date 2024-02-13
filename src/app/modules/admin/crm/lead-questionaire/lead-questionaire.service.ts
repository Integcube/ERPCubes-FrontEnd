import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, catchError, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { User } from 'app/core/user/user.types';
import { Product, Question } from './lead-questionaire.type';
import { UserService } from 'app/core/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class LeadQuestionaireService {
  private readonly getProductsURL = `${environment.url}/Product/all`;
  private readonly getQuestionaireURL = `${environment.url}/Lead/getQuestions`
  private readonly saveQuestionaireURL = `${environment.url}/Lead/saveQuestions`
  user: User;
  private _products: BehaviorSubject<Product[] | null> = new BehaviorSubject(null);
  private _questions: BehaviorSubject<Question[] | null> = new BehaviorSubject(null);
  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    private snackBar: MatSnackBar,
  ) { this._userService.user$.subscribe(user => this.user = user) }
  get products$(): Observable<Product[]> {
    return this._products.asObservable();
  }

  get questions$(): Observable<Question[]> {
    return this._questions.asObservable();
  }

  getProducts(): Observable<Product[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
    }
    return this._httpClient.post<Product[]>(this.getProductsURL, data).pipe(
      tap(products => {
        this._products.next(products);
      }),
      catchError(err => this.handleError(err))
    )
  }

  getQuestionaire(id: number): Observable<Question[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      productId: id
    }
    return this._httpClient.post<Question[]>(this.getQuestionaireURL, data).pipe(
      tap(data => {
        this._questions.next(data);
      }),
      catchError(err => this.handleError(err))
    )
  }

  saveQuestionaire(questions: Question[]): Observable<Question[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      questions: { ...questions }
    }
    return this._httpClient.post<any>(this.saveQuestionaireURL, data).pipe(
      tap(() => {
        this.getProducts();
      }),
      catchError(err => this.handleError(err))
    )
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    this.showNotification('snackbar-success', errorMessage, 'bottom', 'center');
    return throwError(() => errorMessage);
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
