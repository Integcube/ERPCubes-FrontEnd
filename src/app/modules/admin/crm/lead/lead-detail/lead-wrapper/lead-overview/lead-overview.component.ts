import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import{LeadDetailComponent} from 'app/modules/admin/crm/lead/lead-detail/lead-detail.component'
import { LeadService } from '../../../lead.service';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-lead-overview',
  templateUrl: './lead-overview.component.html',
  styleUrls: ['./lead-overview.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class LeadOverviewComponent implements AfterViewInit {


  @ViewChildren('step') steps: QueryList<ElementRef>
  //arrows = [{"name":'New', "selected":0},{"name":'Contacted', "selected":1},{"name":'Interested', "selected":2},{"name":'Qualified', "selected":3},{"name":'Lost', "selected":3}]

  constructor(
    private _fuseComponentsComponent: LeadDetailComponent,
    private _leadService: LeadService,
  ) {
   
  }

  leadStatus$ = this._leadService.leadStatus$
  lead$ = this._leadService.lead$;

  ngAfterViewInit() {
    this.lead$.subscribe((leadData) => {
      if (leadData && leadData.status) {this.goToStep(leadData.status)}});
  
  }
  toggleDrawer(): void
  {
      this._fuseComponentsComponent.matDrawer.toggle();
  }

  ChangeStatus(statusId:number,Title:any) {
    let leadId = -1;
    this.lead$.subscribe((leadData) => {
      if (leadData) {leadId = leadData.leadId;}});

    this._leadService.ChangeLeadStatus(leadId,statusId,Title).subscribe({
      next: () => {
        this.goToStep(statusId);
      },
      error: (err) => {
        alert(`Daniyal: ${JSON.stringify(err)}`);
      },
    });
  }



  goToStep(statusId: number) {
    let index=-1;
    this.leadStatus$.pipe(take(1)).subscribe((leadStatusList:any) => {
       index = leadStatusList.findIndex((status) => status.statusId === statusId);
       index++
    });
    const maxIndex = this.steps.length;
    this.steps.forEach((step, i) => {
      if (i + 1 === index) {
        if (i + 1 === maxIndex) {
          step.nativeElement.classList.add('lastcurrent');
        }
        else
        {
          step.nativeElement.classList.add('current');
          step.nativeElement.classList.remove('done'); 
        }        
      }
      else if (i + 1 < index) {
        step.nativeElement.classList.add('done');
      }
      else {
        step.nativeElement.classList.remove('current', 'done','lastcurrent');
      }
    });
  }
  
  

}
