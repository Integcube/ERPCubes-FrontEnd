import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
@Component({
  selector: 'app-opportunity-overview',
  templateUrl: './opportunity-overview.component.html',
  styleUrls: ['./opportunity-overview.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class OpportunityOverviewComponent implements AfterViewInit {
  @ViewChildren('step') steps: QueryList<ElementRef>
  arrows = [{"name":'New', "selected":0},{"name":'Contacted', "selected":1},{"name":'Interested', "selected":2},{"name":'Qualified', "selected":3},{"name":'Lost', "selected":3}]
  constructor() {
  }
  ngAfterViewInit() {
    const selectedIndex = this.arrows.findIndex(arrow => arrow.selected === 0);
    if (selectedIndex !== -1) {
      this.goToStep(selectedIndex + 1);
    }
  }
  goToStep(index: number) {
    const maxIndex = this.steps.length;
    this.steps.forEach((step, i) => {
      if (i + 1 === index) {
        if (i + 1 === maxIndex) {
          step.nativeElement.classList.add('lastcurrent');
        }
        else {
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
