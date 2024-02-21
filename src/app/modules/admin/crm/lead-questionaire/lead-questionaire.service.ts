import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, tap, throwError } from 'rxjs';
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
    private _httpClient: HttpClient)
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
      
    )
  }

}
