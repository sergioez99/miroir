import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonBackComponent } from './button-back/button-back.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ButtonBackComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
  ],
  exports: [
    MaterialModule,

    ButtonBackComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
  ],
})
export class ElementosComunesModule { }
