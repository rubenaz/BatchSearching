import { SearchingComponent } from './searching/searching.component';
import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = ' app';
  /*routes: Routes = [
    { path: 'search', component:SearchingComponent  },
    { path: '', redirectTo: '/search ', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
  ] */
  
}

