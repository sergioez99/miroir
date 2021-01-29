import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';
import { NotAuthComponent } from './commons/not-auth/not-auth.component';


const routes: Routes = [
  //    /home               --> PagesRoutingModule
  //    /probador           --> PagesRoutingModule
  {
    path: '**', redirectTo: '/home'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),

    PagesRoutingModule,
    AuthRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
