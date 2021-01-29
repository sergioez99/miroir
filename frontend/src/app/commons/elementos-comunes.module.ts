import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonBackComponent } from './button-back/button-back.component';
import { FooterComponent } from './footer/footer.component';
// import { InputEmailComponent } from './input-email/input-email.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ButtonBackComponent,
    FooterComponent,
    // InputEmailComponent,
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
    // InputEmailComponent,
    NavbarComponent,
    SidebarComponent,
  ],
})
export class ElementosComunesModule { }
