import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { Probador01Component } from './probador01/probador01.component';
import { HomeComponent } from './home/home.component';
import { BaseLayoutComponent } from '../layouts/base-layout/base-layout.component';
import { PlanesComponent } from './planes/planes.component';
import { PerfilAdminComponent } from './perfil/perfil-admin/perfil-admin.component';
import { PerfilClienteComponent } from './perfil/perfil-cliente/perfil-cliente.component';
import { PerfilUsuarioComponent } from './perfil/perfil-usuario/perfil-usuario.component';
import { NotAuthComponent } from './perfil/not-auth/not-auth.component';
import { PerfilGuard } from '../services/guards/perfil.guard';
import { PerfilLayoutComponent } from '../layouts/perfil-layout/perfil-layout.component';
import { UsuariosAdminComponent } from './perfil/perfil-admin/usuarios-admin/usuarios-admin.component';
import { PrendasAdminComponent } from './perfil/perfil-admin/prendas-admin/prendas-admin.component';


const routes: Routes = [
  {
    path: 'probador', component: BaseLayoutComponent,
    children: [
      { path: '', component: Probador01Component },
      { path: '**', redirectTo: ''}
    ]
  },
  {
    path: 'home', component: BaseLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: '**', redirectTo: ''}
    ]
  },
  {
    path: 'planes', component: BaseLayoutComponent,
    children: [
      { path: '', component: PlanesComponent },
      { path: '**', redirectTo: ''}
    ]
  },
  {
    path: 'perfil', component: BaseLayoutComponent,
    canActivate: [ PerfilGuard ],
    canActivateChild: [ PerfilGuard ],
    children: [
      { path: '', component: NotAuthComponent },
      { path:'admin', component:PerfilAdminComponent,
        children:[
          { path:'usuarios', component: UsuariosAdminComponent },
          { path:'prendas', component: PrendasAdminComponent },
          { path: '**', redirectTo: '' }
        ]},
      { path:'cliente', component:PerfilClienteComponent,},
      { path:'usuario', component:PerfilUsuarioComponent,},
      { path: '**', redirectTo: ''}
    ]
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
