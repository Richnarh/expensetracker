import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Project, Tracker } from '@app/models/model';
import { CrudService } from '@app/services/crud.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';

interface ExpenseSummary {
  id:string;
  name:string;
  amount:number;
}
interface RevenueSummary extends ExpenseSummary{}

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit{
  public activeModal = inject(NgbActiveModal);
  private crud = inject(CrudService);
  public project!:Project;
  public PnL = 0;
  public balance = 0;
  public totalRevenue = 0;
  public totalExpense = 0;

  private expensSummarySubject = new BehaviorSubject<{result: ExpenseSummary[], total: number }>({ result: [], total: 0 });
  public expenseSummary$ = this.expensSummarySubject.asObservable();

  private revenueSummarySubject = new BehaviorSubject<{result: RevenueSummary[], total: number }>({ result: [], total: 0 });
  public revenueeSummary$ = this.revenueSummarySubject.asObservable();

  ngOnInit(): void {
    this.crud.fetchAll(`trackers/project/${this.project.id}`)
    .subscribe(({ data }) => {
      const expense:ExpenseSummary[] = [];
      const revenue:RevenueSummary[] = [];

      let expenseTotal = 0, revenueTotal = 0;

      data.map((item:Tracker) => {
        if(item.trackType === 'EXPENSE'){
          expense.push({
            id: item.id,
            name: item.itemName,
            amount: item.amount
          });
          expenseTotal += item.amount;
        }else{
          revenue.push({
            id: item.id,
            name: item.itemName,
            amount: item.amount
          });
          revenueTotal += item.amount;
        }
      });
      this.totalRevenue = revenueTotal;
      this.totalExpense = expenseTotal;
      this.PnL = revenueTotal - expenseTotal;
      this.balance = this.project.capitalInvestment - expenseTotal; 
      this.expensSummarySubject.next({ result: expense, total: expenseTotal });
      this.revenueSummarySubject.next({ result: revenue, total: revenueTotal });
    });
  }
}
