import { HttpClientModule } from '@angular/common/http';
import { APIservice } from './searching/searching.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { EventsServiceModule } from 'angular-event-service';
import { NgxPermissionsModule } from 'ngx-permissions';


import { AppComponent } from './app.component';
import { SearchingComponent } from './searching/searching.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    SearchingComponent,  
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule,
    HttpClientModule,
    EventsServiceModule,
    NgxPermissionsModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos'})

  ],
  providers: [APIservice,AppComponent],
  bootstrap: [AppComponent]
})

export class AppModule { }
