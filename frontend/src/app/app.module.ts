import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material/material.module';

import { CarouselModule, WavesModule } from 'angular-bootstrap-md';
import { SidebarComponent } from './commons/sidebar/sidebar.component';
import { SidebarModule } from 'ng-sidebar';
import { NotAuthComponent } from './commons/not-auth/not-auth.component';
import { PerfilLayoutComponent } from './layouts/perfil-layout/perfil-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    PerfilLayoutComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    PagesModule,
    BrowserAnimationsModule,

    MaterialModule,

    CarouselModule,
    WavesModule,


    // MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
