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
  results:any[]=[];//all result of the api
  allSearch:string[];//all the search of the user
  allType:string[];//each type of each search
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

  this.apiUrl=this.service.returnURL(this.typed,this.allSearch[i])//get the url for the response of json
  console.log( this.apiUrl);
  this.http.get(this.apiUrl).subscribe(data => {
    this.results[i]=data.json();
    // data is now an instance of type ItemsResponse, so you can do this:
    if(this.typed=="photo")
       this.results[i]=this.results[i].Image;
      if(this.typed=="review")
      this.results[i]=this.results[i].AbstractText;
    
    if(this.typed=="trailer")
    {
      this.results[i]= "https://www.youtube.com/embed/" +this.results[i].items[0].id.videoId;
      this.results[i]=this.sanitizer.bypassSecurityTrustResourceUrl(this.results[i]);
    }
      this.pressed=true;
     /* var CurrentPhotoUrl = 'https://farm'+_s[i]['farm']+'.staticflickr.com/'+_s[i]['server']+'/'+_s[i]['id']+'_'+_s[i]['secret']+'_n.jpg'
      console.log(CurrentPhotoUrl);  */

  

  });
  //===============================================================================================
}
  }
  
  

  ngOnInit() :void{ }
}
