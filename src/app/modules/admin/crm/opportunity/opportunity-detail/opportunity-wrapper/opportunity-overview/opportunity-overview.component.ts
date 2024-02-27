import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { OpportunityDetailComponent } from '../../opportunity-detail.component';
import { OpportunityService } from '../../../opportunity.service';
import { take } from 'rxjs';
@Component({
  selector: 'app-opportunity-overview',
  templateUrl: './opportunity-overview.component.html',
  styleUrls: ['./opportunity-overview.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class OpportunityOverviewComponent implements AfterViewInit {
  @ViewChildren('step') steps: QueryList<ElementRef>
  //arrows = [{"name":'New', "selected":0},{"name":'Contacted', "selected":1},{"name":'Interested', "selected":2},{"name":'Qualified', "selected":3},{"name":'Lost', "selected":3}]
  
  constructor(
    private _fuseComponentsComponent: OpportunityDetailComponent,
    private _opportunityService: OpportunityService )
  { }

  opportunityStatus$ = this._opportunityService.opportunityStatus$
  opportunity$ = this._opportunityService.opportunity$;

  ngAfterViewInit() {
    this.opportunity$.subscribe((opportunityData) => {
      if (opportunityData && opportunityData.statusId) {this.goToStep(opportunityData.statusId)
      }});
  }

  toggleDrawer(): void
  {
      this._fuseComponentsComponent.matDrawer.toggle();
  }

  ChangeStatus(statusId:number,Title:any) {
    let opportunityId = -1;
    this.opportunity$.subscribe((opportunityData) => {
      if (opportunityData) {opportunityId = opportunityData.opportunityId;}});

    this._opportunityService.ChangeOpportunityStatus(opportunityId,statusId,Title).subscribe({
      next: () => {
        this.goToStep(statusId);
      },
    });
  }

  goToStep(statusId: number) {
    let index=-1;
    this.opportunityStatus$.pipe(take(1)).subscribe((opportunityStatusList:any) => {
       index = opportunityStatusList.findIndex((status) => status.statusId === statusId);
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
