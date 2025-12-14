import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { NgbModalModule, NgbModal, NgbModalConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { noop } from 'rxjs';
import {  RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddProjectComponent } from '@app/add-project/add-project.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,NgbModalModule,NgbDropdownModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  private modal = inject(NgbModal);
  public isAuthenticated: boolean | undefined;

  @ViewChild('navbarCollapse') navbarCollapse!: ElementRef;
  @ViewChild('navbarToggler') navbarToggler!: ElementRef;
  isNavbarOpen = false;

  constructor(){
    inject(NgbModalConfig).centered = true;
  }
  
  ngOnInit(): void {
  }

  public creatProject(){
    this.modal.open(AddProjectComponent, {size:'md', backdrop:'static'}).result.then(() => noop);
  }


  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
    const collapse = this.navbarCollapse.nativeElement;
    collapse.classList.toggle('show', this.isNavbarOpen);
  }

  closeNavbar() {
    if (this.isNavbarOpen) {
      this.isNavbarOpen = false;
      const collapse = this.navbarCollapse.nativeElement;
      collapse.classList.remove('show');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.navbarCollapse?.nativeElement.contains(event.target) ||
                          this.navbarToggler?.nativeElement.contains(event.target);
    if (!clickedInside && this.isNavbarOpen) {
      this.closeNavbar();
    }
  }
}
