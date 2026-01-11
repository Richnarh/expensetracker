import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { LoadingOverlayComponent } from './shared/overlay/loading.overlay.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Project } from './models/model';
import { BehaviorSubject, noop } from 'rxjs';
import { CrudService } from './services/crud.service';
import { NgPipesModule } from 'ngx-pipes';
import { AddProjectComponent } from './add-project/add-project.component';
import { ExpenseRevenueComponent } from './expense-revenue/expense-revenue.component';
import { ToastrService } from 'ngx-toastr';
import { SummaryComponent } from './summary/summary.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgPipesModule, HeaderComponent,LoadingOverlayComponent, DecimalPipe, FormsModule, NgbTypeaheadModule, NgbPaginationModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private crud = inject(CrudService);
  private modal = inject(NgbModal);
  private toast = inject(ToastrService);
  private projectsSubject:BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  public loading = signal<boolean>(false);
  public error = signal<string | null>(null);
  private allProjects: Project[] = [];
  public searchTerm = '';
  
  page = 1;
	pageSize = 10;
	collectionSize = this.projectsSubject.value.length;
	constructor() {
      this.crud.data$.subscribe({
        next: (project) => {
          if (project) {
            this.loadProjects();
          }
        },
        error: (err) => {
          this.error.set(err.message);
        }
      });
		this.loadProjects();
	}

  private updateView() {
    const filtered = this.allProjects.filter((p) =>
      p.projectName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    const sorted = filtered.sort((a, b) =>
      a.projectName.toLowerCase().localeCompare(b.projectName.toLowerCase())
    );
    const indexed = sorted.map((project, i) => ({
      ...project,
    }));

    const paged = indexed.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
    this.projectsSubject.next(paged);
    this.collectionSize = sorted.length;
  }


  onSearch(term: string) {
    this.searchTerm = term;
    this.page = 1;
    this.updateView();
  }

  onPageChange(page: number) {
    this.page = page;
    this.updateView();
  }

  loadProjects() {
    this.crud.fetchAll("projects").subscribe(({ data }) => {
      this.allProjects = data;
      this.updateView();
    });
  }

  public creatProject(){
    this.modal.open(AddProjectComponent, {size:'md', backdrop:'static'}).result.then(() => noop);
  }

  get isEmpty(): boolean {
    return this.projectsSubject.value.length === 0;
  }

  get isNoRecords(): boolean {
    return this.allProjects.length === 0;
  }

  public handleEdit(project: Project) {
    const modalRef = this.modal.open(AddProjectComponent, { size: 'md', backdrop: 'static' });
    modalRef.componentInstance.project = project;
    modalRef.result.then(() => noop);
  }

  public createExpenseRevenue(project:Project){
   const expenseModal = this.modal.open(ExpenseRevenueComponent, {size:'xl', backdrop:'static', scrollable:true});
    expenseModal.componentInstance.project = project;
   expenseModal.result.then(() => noop);
  }

  public deleteItem(project:Project){
    const con = confirm('Do you want to delete this item');
    if(!con) return;
    this.crud.delete(project.id, 'projects')
    .subscribe(() => {
      this.toast.success('Item deleted successful');
      this.loadProjects()
    });
  }

  public handleSummary(project:Project){
    const modal = this.modal.open(SummaryComponent, { size: 'md' });
    modal.componentInstance.project = project;
  }
}
