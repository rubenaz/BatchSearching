import { APIservice } from './searching.service';
import { Component, OnInit } from '@angular/core';
import {Http,Response,HttpModule,} from '@angular/http';
import {HttpClient} from '@angular/common/http'; 
import { EventsServiceModule } from 'angular-event-service';
import { AsyncPipe } from '@angular/common';
import { DomSanitizer,SafeResourceUrl, SafeUrl} from '@angular/platform-browser';




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
  allType:string[];
  sort=" ";
  falseInput=false;
  typed="";
  choice="";
  private service=new APIservice();
  

 // s2= new APIservice(this.http)
  constructor(private http:Http,private sanitizer: DomSanitizer) {} 


  onSave(message,type,choice){

  this.input=message;
  this.typed=type;
  this.choice=choice;
  this.allSearch= this.service.load(this.input);
  this.results=Array.of(this.results);
  this.allType=this.service.returnType(this.typed);

  if(this.service.error(this.input)==true)
    return;;

//==============================================================================================
  for(let i=0 ; i<this.allSearch.length;i++){

    if(type!="photo"){
  this.apiUrl="http://api.duckduckgo.com/?q=" + this.allType[i] ; 
  this.apiUrl+=this.allSearch[i] +"&format=json";
    }
    if(type=="trailer")
    {
      this.apiUrl="https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + this.allSearch[i]  +" "+ this.typed+"&key=AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos";
      
    }
  else
  {
this.apiUrl="https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=33870ee66d8bf44b0cc3c8c95cace552&" + this.allSearch[i] +"&format=json&&nojsoncallback=1&per_page=1"
  }
  console.log( this.apiUrl);
  this.http.get(this.apiUrl).subscribe(data => {
    // data is now an instance of type ItemsResponse, so you can do this:
    if(this.typed=="review"){
       this.results[i]=data.json();
    }
    if(this.typed=="trailer")
    {
      console.log(this.sanitizer);
      this.results[i]=data.json();
      this.results[i]= "https://www.youtube.com/embed/" +this.results[i].items[0].id.videoId;
      this.results[i]=this.sanitizer.bypassSecurityTrustResourceUrl(this.results[i]);
      
      
      console.log(this.results[i]);
    }
      this.pressed=true;
      //x is the json returned from the url.
     /* var _s = n.photos.photo;
      var CurrentPhotoUrl = 'https://farm'+_s[i]['farm']+'.staticflickr.com/'+_s[i]['server']+'/'+_s[i]['id']+'_'+_s[i]['secret']+'_n.jpg'
      console.log(CurrentPhotoUrl);  */

  

  });
  //===============================================================================================
}
  }
  
  

  ngOnInit() :void{ }
}
