import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { EntityInfo, Project, projectFields } from '@app/models/model';
import { CrudService } from '@app/services/crud.service';
import { FormsComponent } from '@app/shared/forms/forms.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [FormsComponent],
  template: `
     <app-form [fields]="fields" [entity]="entity" [submitted]="isformSubmitted" [isModal]="true" (formSubmitted)="save($event)"></app-form>
  `,
})
export class AddProjectComponent implements OnInit{
  private crud = inject(CrudService);
  private toast = inject(ToastrService);
  private activeModal = inject(NgbActiveModal);
  private destroyRef = inject(DestroyRef);
  
  public project!:Project
  public fields = projectFields;

  public entity:EntityInfo = { id:'', name: 'Project' };
  public isformSubmitted:boolean = false;


  ngOnInit(): void {
    this.entity.id = this.project?.id;
    this.entity.data = this.project;
  }

   save(form: FormGroup) {
      const payload = { ...form.value} as Project;
      if(this.project && this.project?.id){
        payload.id = this.project.id;
      }
      const projectName = form.get('projectName')?.value;
      this.crud.findById(projectName, 'projects/name')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ data }) => {
        console.log('data: ', data);
        if(!payload.id){
          if(data){
            this.toast.error('Project already exist');
            return;
          }
        }
        this.isformSubmitted = true;
        this.crud.save(payload, 'projects')
        .subscribe({
          next: ({ data,message }) => {
            this.crud.setData(data);
            this.toast.success(message);
            form.reset();
            this.isformSubmitted = false;
            this.activeModal.close();
          },
          error: err => {
            console.error(`err: ${err}`);
            this.isformSubmitted = false;
            if(err.message === 'Unique constraint violation'){
              this.toast.error('Project already exist');
            }else
              this.toast.error(err.message);
          }
        })
      })
    }
}
