import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOutSummaryComponent } from './check-out-summary.component';

describe('CheckOutSummaryComponent', () => {
  let component: CheckOutSummaryComponent;
  let fixture: ComponentFixture<CheckOutSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckOutSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckOutSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
