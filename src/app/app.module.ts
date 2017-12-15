import { HttpClientModule } from '@angular/common/http';
import { APIservice } from './searching/searching.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { EventsServiceModule } from 'angular-event-service';
import { NgxPermissionsModule } from 'ngx-permissions';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SearchingComponent } from './searching/searching.component';
import { AgmCoreModule } from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [
    AppComponent,
    SearchingComponent,  
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatTableModule,
    HttpModule,
    NgbModule,
    HttpClientModule,
    EventsServiceModule,
    MatInputModule,
    NgxPermissionsModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos'})

  ],
  providers: [APIservice,AppComponent],
  bootstrap: [AppComponent]
})

export class AppModule { }
