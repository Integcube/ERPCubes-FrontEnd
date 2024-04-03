import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AssignedCheckPoint } from '../execute-checklist.type';
import { Subject, takeUntil } from 'rxjs';
import { ExecuteChecklistService } from '../execute-checklist.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-execute-form',
  templateUrl: './execute-form.component.html',
  styleUrls: ['./execute-form.component.scss']
})
export class ExecuteFormComponent implements OnInit {

  checkPoints:AssignedCheckPoint[]=[];
  execId:number;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _checklistService:ExecuteChecklistService,
    private _route: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    ) 
  {}
  
  ngOnInit(): void {
   
    this._route.paramMap.pipe(takeUntil(this._unsubscribeAll)).subscribe(params => {
      this.execId = +params.get('id');
    });

    this._checklistService.checkPoint$
    .subscribe(data => {
      this.checkPoints = [...data];
      this._changeDetectorRef.detectChanges();
    });

  }
  


  closeDialog() {

  }

  toggleStatus(cp) {
    let status: number = -1;
    if (cp.status === 1) {
      status = 0;
    } else {
      status = 1;
    }
    this._checklistService.setStatus(status, this.execId , cp.cpId).pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
      this._checklistService.getCheckpoint(this.execId ).subscribe(
        data=>{this.checkPoints = [...data]
      }
      )
    });
  }
}