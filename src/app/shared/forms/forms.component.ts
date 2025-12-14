import { Component, EventEmitter, HostListener, inject, Input, OnInit, Output } from '@angular/core';
import { FormField } from './config/config';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EntityInfo } from '@app/models/model';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent implements OnInit{
  @Input() fields: FormField[] = [];
  @Input() entity: EntityInfo | undefined;
  @Input({ alias:'submitted', required:true }) submitted: boolean = false;
  @Input() isModal:boolean = false;
  @Output() formSubmitted = new EventEmitter<FormGroup>();
  public form!: FormGroup;
  private fb = inject(FormBuilder);

  public activeModal = inject(NgbActiveModal);

  constructor(){
     this.form = this.fb.group({});
  }

  ngOnInit() {
    this.fields.forEach(field => {
      const validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.type === 'email') validators.push(Validators.email);
      const control = this.fb.control(field.value || null, validators);
      this.form.addControl(field.name, control);
    });
    if(this.entity?.data){
      const data = { ...this.entity.data };
      Object.keys(data).forEach(key => {
        const field = this.fields.find(f => f.name === key);
        if (((field?.type === 'date') || (field?.type === 'datetime')) && data[key]) {
          data[key] = new Date(data[key]).toISOString().split('T')[0];
        }
      });
      this.form.patchValue(data);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  public unloadNotification($event: BeforeUnloadEvent) {
    if (this.form.dirty) {
      $event.preventDefault();
    }
  }

  public onSubmit() {
     if (this.form.valid) {
        this.formSubmitted.emit(this.form);
    }
  }

  public validate(controlName: string, label?: string) {
    const control: FormControl = this.form.get(controlName) as FormControl;
    if (control?.hasError('required')) return `${label || controlName} is required field.`
    return null;
  }
}
