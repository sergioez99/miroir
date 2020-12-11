import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';



import { Probador01Component } from './probador01/probador01.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from '../commons/footer/footer.component';
import { NavbarComponent } from '../commons/navbar/navbar.component';
import { BaseLayoutComponent } from '../layouts/base-layout/base-layout.component';
import { ButtonBackComponent } from '../commons/button-back/button-back.component';

@NgModule({
  declarations: [
    BaseLayoutComponent,

    Probador01Component,
    HomeComponent,

    NavbarComponent,
    FooterComponent,


  ],
  exports: [
    BaseLayoutComponent,
    Probador01Component,
    HomeComponent,

    NavbarComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
})
export class PagesModule { }
