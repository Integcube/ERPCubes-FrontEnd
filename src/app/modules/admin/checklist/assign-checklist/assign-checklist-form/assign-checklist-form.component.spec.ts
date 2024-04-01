import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignChecklistFormComponent } from './assign-checklist-form.component';

describe('AssignChecklistFormComponent', () => {
  let component: AssignChecklistFormComponent;
  let fixture: ComponentFixture<AssignChecklistFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignChecklistFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignChecklistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
