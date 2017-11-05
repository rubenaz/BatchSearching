import { APIservice } from './searching/searching.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SearchingComponent } from './searching/searching.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchingComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [APIservice],
  bootstrap: [AppComponent]
})
export class AppModule { }
