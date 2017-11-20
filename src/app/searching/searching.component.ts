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
//cle api flickr 33870ee66d8bf44b0cc3c8c95cace552
//secret 10de5f4189fc5ddd
//id LJWS3MTZIOEOU35YFVDF 5DNH67

export class SearchingComponent implements OnInit {
  input;
  private apiUrl;
  pressed=false;
  results:any[]=[];
  allSearch:string[];
  sort=" ";
  falseInput=false;
  private service=new APIservice();
  

 // s2= new APIservice(this.http)
  constructor(private http:Http) {} 

setRadio(sort)
{
  this.sort=sort;
}

  onSave(message){
  this.input=message;
  this.allSearch= this.service.load(this.input);
  this.results=Array.of(this.results);

  if(this.service.error(this.input)==true)
    return;;

//==============================================================================================
  for(let i=0 ; i<this.allSearch.length;i++){

    if(this.sort!="image"){
  this.apiUrl="http://api.duckduckgo.com/?q="; 
  this.apiUrl+=this.allSearch[i]+"&format=json";
    }
  else
  {
this.apiUrl="https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=33870ee66d8bf44b0cc3c8c95cace552&" + this.allSearch[i] +"&format=json&&nojsoncallback=1&per_page=1"
  }
  console.log( this.apiUrl);
  this.http.get(this.apiUrl).subscribe(data => {
    // data is now an instance of type ItemsResponse, so you can do this:
    if(this.sort!="image")
       this.results[i]=data.json();
    else
    {
      this.results[i]=data;
      console.log(this.results[i]._body);

      //x is the json returned from the url.
     /* var _s = n.photos.photo;
      var CurrentPhotoUrl = 'https://farm'+_s[i]['farm']+'.staticflickr.com/'+_s[i]['server']+'/'+_s[i]['id']+'_'+_s[i]['secret']+'_n.jpg'
      console.log(CurrentPhotoUrl);  */
    } 

    
    this.pressed=true;
  });
  //===============================================================================================
}
  }
  
  

  ngOnInit() :void{ }
}
