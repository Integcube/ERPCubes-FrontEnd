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
  private readonly saveQuestionaireURL = `${environment.url}/Lead/saveQuestion`
  private readonly deleteQuestionURL = `${environment.url}/Lead/deleteQuestion`
  private readonly saveCopyQuestionurl = `${environment.url}/Lead/saveCopyQuestion`
  user: User;
  private _products: BehaviorSubject<Product[] | null> = new BehaviorSubject(null);
  private _product: BehaviorSubject<Product | null> = new BehaviorSubject(null);
  private _questions: BehaviorSubject<Question[] | null> = new BehaviorSubject(null);
  private _copyquestions: BehaviorSubject<Question[] | null> = new BehaviorSubject(null);
  
  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    private snackBar: MatSnackBar,
  ) { this._userService.user$.subscribe(user => this.user = user) }
  get products$(): Observable<Product[]> {
    return this._products.asObservable();
  }
  get product$(): Observable<Product> {
    return this._product.asObservable();
  }
  get questions$(): Observable<Question[]> {
    return this._questions.asObservable();
  }

  get copyquestions$(): Observable<Question[]> {
    return this._copyquestions.asObservable();
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

  selectedProduct(product: Product){
    this._product.next(product)
  }

  getQuestionaire(): Observable<Question[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      productId: this._product.value.productId
    }
    return this._httpClient.post<Question[]>(this.getQuestionaireURL, data).pipe(
      tap(data => {
        this._questions.next(data);
      }),
      catchError(err => this.handleError(err))
    )
  }


  getQuestion(prodId:number): Observable<Question[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      productId: prodId
    }
    return this._httpClient.post<Question[]>(this.getQuestionaireURL, data).pipe(
      tap(data => {
        this._copyquestions.next(data);
      }),
      catchError(err => this.handleError(err))
    )
  }

  saveQuestion(questions: Question): Observable<Question[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      question: {
        ...questions,
        productId: this._product.value.productId
      }
    }
    return this._httpClient.post<any>(this.saveQuestionaireURL, data).pipe(
      tap(() => {
        this.getQuestionaire().subscribe();
      }),
      catchError(err => this.handleError(err))
    )
  }

  saveCopyQuestion(questions: Question[]): Observable<Question[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
       productId: this._product.value.productId,
       questions,
    }
    return this._httpClient.post<any>(this.saveCopyQuestionurl, data).pipe(
      tap(() => {
        this.getQuestionaire().subscribe();
      }),
      catchError(err => this.handleError(err))
    )
  }

  deleteQuestion(question: Question): Observable<Question[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      questionId: question.questionId 
    }
    return this._httpClient.post<any>(this.deleteQuestionURL, data).pipe(
      tap(() => {
        this.getQuestionaire().subscribe();
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
