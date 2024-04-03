import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuteFormComponent } from './execute-form.component';

describe('ExecuteFormComponent', () => {
  let component: ExecuteFormComponent;
  let fixture: ComponentFixture<ExecuteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecuteFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecuteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
