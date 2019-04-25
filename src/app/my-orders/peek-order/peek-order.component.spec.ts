import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeekOrderComponent } from './peek-order.component';

describe('PeekOrderComponent', () => {
  let component: PeekOrderComponent;
  let fixture: ComponentFixture<PeekOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeekOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeekOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
