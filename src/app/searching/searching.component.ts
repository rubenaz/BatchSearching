import { APIservice } from './searching.service';
import { Component, OnInit } from '@angular/core';
import {Http,Response,HttpModule,} from '@angular/http';
import {HttpClient} from '@angular/common/http'; 
import { EventsServiceModule } from 'angular-event-service';



interface ItemsResponse {
  results: string[];
} 
@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.css'],
 template: `
  <h1>Your Search</h1>
  <input #box/>
  <button (click)="onSave(box.value)">Search</button>
  `
})


export class SearchingComponent implements OnInit {
  input;
  results:string[];
  private apiUrl;
  
 // s2= new APIservice(this.http);
  constructor(private http:HttpClient) {
  }
    onSave(message){
      this.input=message;
      this.apiUrl="http://api.duckduckgo.com/?q="; 
      this.apiUrl+=message+"&format=json";
      this.http.get<ItemsResponse>(this.apiUrl).subscribe(data => {
        // data is now an instance of type ItemsResponse, so you can do this:
        this.results = data.results;
        console.log(data);
        console.log( this.apiUrl);
      });
    }    

  ngOnInit() :void{  }
}
