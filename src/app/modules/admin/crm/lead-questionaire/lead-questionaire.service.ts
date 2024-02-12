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
  private _products: BehaviorSubject<Product[]| null> = new BehaviorSubject(null);
  private _product: BehaviorSubject<Product | null> = new BehaviorSubject(null);
  private _questions:  BehaviorSubject<Question[] | null> = new BehaviorSubject(null);
  private _question:  BehaviorSubject<Question | null> = new BehaviorSubject(null);
  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    private snackBar: MatSnackBar,
  ) 
  { this._userService.user$.subscribe(user => this.user = user) }
  get products$(): Observable<Product[]> {
    return this._products.asObservable();
  }
  get product$(): Observable<Product> {
    return this._product.asObservable();
  }
  get questions$(): Observable<Question[]> {
    return this._questions.asObservable();
  }
  get question$(): Observable<Question> {
    return this._question.asObservable();
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

  selectedProduct(id: number): Observable<Product> {
    return this._products.pipe(
      take(1),
      map((products) => {
        if (id === -1) {
          const product = new Product({});
          this._product.next(product);
          return product;
        }
        else {
           
          const product = products.find(item => item.productId === id) || null;
          this._product.next(product);
          return product;
        }
      }),
      switchMap((product) => {
        if (!product) {
          return throwError('Could not find Product with id of ' + id + '!');
        }
        return of(product);
      })
    );
  }

  getQuestionaire(id: number): Observable<Question[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      productId: id
    }
    return this._httpClient.post<Question[]>(this.getQuestionaireURL, data).pipe(
      tap(data => {
        if(data == null){
          debugger;
          this._questions.value.push(new Question({}));
        }
        else{

        }
        this._questions.next(data);
      }),
      catchError(err => this.handleError(err))
    )
  }

  saveQuestionaire(questions: Question[]): Observable<Question[]> {
    let data = {
      id: this.user.id,
      tenantId: this.user.tenantId,
      questions: {...questions}
    }
    debugger;
    return this._httpClient.post<any>(this.saveQuestionaireURL, data).pipe(
      tap(() => {
        this.getProducts();
      }),
      catchError(err => this.handleError(err))
    )
  }

  selectedQuestion(id: number): Observable<Question> { 
    return this._questions.pipe(
      take(1),
      map((questions) => {
        if (id === -1) {
          const question = new Question({});
          this._question.next(question);
          return question;
        }
        else {
           debugger;
          const question = questions.find(item => item.questionId === id) || null;
          this._question.next(question);
          return question;
        }
      }),
      switchMap((question) => {
        if (!question) {
          return throwError('Could not find Question with Id of ' + id + '!');
        }
        return of(question);
      })
    );
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
