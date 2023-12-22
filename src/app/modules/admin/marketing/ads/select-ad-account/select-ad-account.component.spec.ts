import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAdAccountComponent } from './select-ad-account.component';

describe('SelectAdAccountComponent', () => {
  let component: SelectAdAccountComponent;
  let fixture: ComponentFixture<SelectAdAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectAdAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAdAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
