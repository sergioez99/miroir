import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { Probador01Component } from './probador01/probador01.component';
import { HomeComponent } from './home/home.component';
import { BaseLayoutComponent } from '../layouts/base-layout/base-layout.component';
import { PlanesComponent } from './planes/planes.component';


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
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
