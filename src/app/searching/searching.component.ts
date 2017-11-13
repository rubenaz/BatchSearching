import { APIservice } from './searching.service';
import { Component, OnInit } from '@angular/core';
import {Http,Response,HttpModule,} from '@angular/http';
import {HttpClient} from '@angular/common/http'; 
import { EventsServiceModule } from 'angular-event-service';
import { AsyncPipe } from '@angular/common';




@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.css']                
})


export class SearchingComponent implements OnInit {
  input;
  private apiUrl;
  pressed=false;
  public results:any[]=[];

 // s2= new APIservice(this.http)
  constructor(private http:Http,private service:APIservice) {} 

  onSave(message){
  this.input=message;
  this.apiUrl="http://api.duckduckgo.com/?q="; 
  this.apiUrl+=this.input+"&format=json";
  console.log( this.apiUrl);
  this.http.get(this.apiUrl).subscribe(data => {
    // data is now an instance of type ItemsResponse, so you can do this:
    this.results = data.json();
    this.results=Array.of(this.results);
    console.log(this.results[0]);
    this.service.load(this.results);
    this.pressed=true;
  });
  }
  
  

  ngOnInit() :void{ }
}
