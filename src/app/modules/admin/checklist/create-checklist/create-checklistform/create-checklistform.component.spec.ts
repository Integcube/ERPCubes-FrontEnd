import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChecklistformComponent } from './create-checklistform.component';

describe('CreateChecklistformComponent', () => {
  let component: CreateChecklistformComponent;
  let fixture: ComponentFixture<CreateChecklistformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateChecklistformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateChecklistformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
