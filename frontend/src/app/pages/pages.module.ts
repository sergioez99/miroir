import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CarouselModule, WavesModule } from 'angular-bootstrap-md'; //carrusel


import { Probador01Component } from './probador01/probador01.component';
import { HomeComponent } from './home/home.component';
// import { FooterComponent } from '../commons/footer/footer.component';
// import { NavbarComponent } from '../commons/navbar/navbar.component';
import { BaseLayoutComponent } from '../layouts/base-layout/base-layout.component';
// import { ButtonBackComponent } from '../commons/button-back/button-back.component';
import { PlanesComponent } from './planes/planes.component';
import { AdminUsuariosComponent } from './admin/admin-usuarios/admin-usuarios.component';
import { PerfilComponent } from './perfil/perfil.component';
// import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfilAdminComponent } from './perfil/perfil-admin/perfil-admin.component';

import { SidebarModule } from 'ng-sidebar';
// import { SidebarComponent } from '../commons/sidebar/sidebar.component';
import { PerfilClienteComponent } from './perfil/perfil-cliente/perfil-cliente.component';
import { PerfilUsuarioComponent } from './perfil/perfil-usuario/perfil-usuario.component';
import { NotAuthComponent } from './perfil/not-auth/not-auth.component';
import { ElementosComunesModule } from '../commons/elementos-comunes.module';
import { UsuariosAdminComponent } from './perfil/perfil-admin/usuarios-admin/usuarios-admin.component';
import { PrendasAdminComponent } from './perfil/perfil-admin/prendas-admin/prendas-admin.component';

@NgModule({
  declarations: [
    BaseLayoutComponent,

    Probador01Component,
    HomeComponent,

    // NavbarComponent,
    // FooterComponent,
    PlanesComponent,
    AdminUsuariosComponent,
    PerfilComponent,
    NotAuthComponent,
    PerfilAdminComponent,
    PerfilClienteComponent,
    PerfilUsuarioComponent,
    UsuariosAdminComponent,
    PrendasAdminComponent,

    // SidebarComponent,
    // ButtonBackComponent,




  ],
  exports: [
    BaseLayoutComponent,
    Probador01Component,
    HomeComponent,

    // NavbarComponent,
    // FooterComponent,
    ReactiveFormsModule,
  ],
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule,
    WavesModule,
    ReactiveFormsModule,

    ElementosComunesModule,

    SidebarModule.forRoot()
  ],
})
export class PagesModule { }
