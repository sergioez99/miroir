import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { Probador01Component } from './probador01/probador01.component';
import { HomeComponent } from './home/home.component';
import { BaseLayoutComponent } from '../layouts/base-layout/base-layout.component';
import { PlanesComponent } from './planes/planes.component';
import { PerfilComponent } from './perfil/perfil.component';
import { LoginGuard } from '../services/guards/login.guard';
import { PerfilAdminComponent } from './perfil/perfil-admin/perfil-admin.component';
import { AdminGuard } from '../services/guards/admin.guard';


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
    canActivate: [ LoginGuard ],
    children: [
      { path: '', component: PerfilComponent },
      { path:'admin', component:PerfilAdminComponent, canActivate:[AdminGuard]},
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
