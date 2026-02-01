import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EntityInfo, Project, Tracker, trackerFields } from '@app/models/model';
import { CrudService } from '@app/services/crud.service';
import { FormsComponent } from '@app/shared/forms/forms.component';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-expense-revenue',
  standalone: true,
  imports: [FormsComponent, CommonModule],
  templateUrl: './expense-revenue.component.html',
  styleUrl: './expense-revenue.component.scss'
})
export class ExpenseRevenueComponent implements OnInit{
  private crud = inject(CrudService);
  private toast = inject(ToastrService);

  private trackerSubject:BehaviorSubject<Tracker[]> = new BehaviorSubject<Tracker[]>([]);
  public tracker$ = this.trackerSubject.asObservable();

  public project!:Project;
  public fields = trackerFields
  public entity:EntityInfo = { id:'', name: `Expense or Revenue Items to ` };
  public isformSubmitted:boolean = false;

  ngOnInit(): void {
    this.entity.name += this.project?.projectName;
    this.crud.fetchAll(`trackers/project/${this.project.id}`)
    .subscribe(({ data }) => {
      this.trackerSubject.next(data);
    });
  }

  save(form: FormGroup) {
      if(!this.project){
        this.toast.error('Project not found');
        return;
      }
      const payload = { ...form.value} as Tracker;
      if(this.entity.id){
        payload.id = this.entity.id;
      }
      payload.projectId = this.project.id;
      this.isformSubmitted = true;
      this.crud.save(payload, 'trackers')
      .subscribe({
        next: ({ data, message }) => {
          this.trackerSubject.next([...this.trackerSubject.value, data]);
          this.toast.success(message);
          form.reset();
          this.isformSubmitted = false;
        },
        error: (err) => {
          this.isformSubmitted = false;
          this.toast.error(err.message || 'An error occurred');
        }
      });
   }

   handleEdit(tracker:Tracker) {
      this.entity.id = tracker.id;
      this.entity.data = tracker;
   }

   deleteItem(tracker:Tracker) {
      this.crud.delete(tracker.id || '', 'trackers')
      .subscribe({
        next: () => {
          const updated = this.trackerSubject.value.filter(t => t.id !== tracker.id);
          this.trackerSubject.next(updated);
          this.toast.success('Item deleted successfully');
        },
        error: (err) => {
          this.toast.error(err.message || 'An error occurred');
        }
      });
   }
}
