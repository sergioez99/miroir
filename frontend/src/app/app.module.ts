import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material/material.module';

import { CarouselModule, WavesModule } from 'angular-bootstrap-md';

import { DatePipe } from '@angular/common';
import { TicketComponent } from './ticket/ticket.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

// const MyGoogleChartsSettings: GoogleChartsSettings = {
//   mapsApiKey: 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY',
//   googleChartsVersion: '46',
//   language: 'es',
// };

@NgModule({
  declarations: [
    AppComponent,
    TicketComponent,

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

<<<<<<< HEAD
    MatExpansionModule,
=======
    Ng2GoogleChartsModule
>>>>>>> develop

  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
