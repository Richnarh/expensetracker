import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseRevenueComponent } from './expense-revenue.component';

describe('ExpenseRevenueComponent', () => {
  let component: ExpenseRevenueComponent;
  let fixture: ComponentFixture<ExpenseRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseRevenueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
