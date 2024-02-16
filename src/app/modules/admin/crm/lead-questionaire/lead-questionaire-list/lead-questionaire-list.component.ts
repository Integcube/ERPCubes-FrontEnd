import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LeadQuestionaireService } from '../lead-questionaire.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, Question } from '../lead-questionaire.type';
import { LeadQuestionaireFormComponent } from '../lead-questionaire-form/lead-questionaire-form.component';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-lead-questionaire-list',
  templateUrl: './lead-questionaire-list.component.html',
  styleUrls: ['./lead-questionaire-list.component.scss']
})
export class LeadQuestionaireListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('exporter') public exporter;
  dataSource: MatTableDataSource<Product>;
  displayedColumns: string[] = ['select', 'productName', 'description', 'price'];
  selection = new SelectionModel<Product>(true, []);

  products$: Observable<Product[]>;
  products: Product[];
  productCount: number = 0;
  selectedProduct: Product;
  searchInputControl: UntypedFormControl = new UntypedFormControl();

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _matDialog: MatDialog,
    private _questionaireService: LeadQuestionaireService,
  ) { }

  ngOnInit(): void {
    this.products$ = this._questionaireService.products$;
    this._questionaireService.products$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((products: Product[]) => {
        this.products = [...products];
        this.productCount = products.length;
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this._changeDetectorRef.markForCheck();
      });
  }
  onMouseEnter(row: Product){
    row.isHovered=true;
  }

  onMouseLeave(row: Product){
    row.isHovered=false;
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onBackdropClicked(): void {
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openConnectorDialog(product: Product) {
    this._questionaireService.selectedProduct(product);
    this._questionaireService.getQuestionaire().subscribe();
    
    this._matDialog.open(LeadQuestionaireFormComponent, {
      data:product , 
      autoFocus: false,
    });
  }
  
  exportToExcel() {
    this.exporter.exportTable('xls', { fileName: 'Lead-list' });
  }
}
