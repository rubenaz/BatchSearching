import { APIservice } from './searching.service';
import { Component, OnInit } from '@angular/core';
import {Http,Response,HttpModule,} from '@angular/http';
import {HttpClient} from '@angular/common/http'; 
import { EventsServiceModule } from 'angular-event-service';
import { AsyncPipe } from '@angular/common';
import { DomSanitizer,SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { AgmCoreModule } from '@agm/core';
import { MatTableDataSource } from '@angular/material/table';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';




export interface Element {
  position: number;
  name: string;
  url: string;
}

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.css']                
})

export class SearchingComponent implements OnInit {

//==================================VARIABLE=====================================================================

  input;
  private apiUrl;
  pressed=false;
  urlArray:any[]=[];
  jsonArray:any[]=[];
  results:any[]=[];//all result of the api
  ELEMENT_DATA: Element[] =[]// [{position: 1, name: 'Hydrogen', url:'https://duckduckgo.com/i/7dceb552.jpg'}];
  displayedColumns = ['position', 'name', 'url'];
  dataSource;//= new MatTableDataSource(this.ELEMENT_DATA);
  allSearch:string[];//all the search of the user
  allType:string[];//each type of each search
  falseInput=false;
  count=0;
  typed="";
  choice="";
  private service=new APIservice();

//==================================================================================================================
  
  constructor(private http:Http,private sanitizer: DomSanitizer) {} 

//============================FUNCTIONS==========================================================================
public saveUrl(i)
{
  this.jsonArray[i]=this.results[i];
}
public loadPage(i)
{
      if(this.typed=="photo"){
        this.urlArray[i]=this.results[i].Image;}

      if(this.typed=="wiki"){
      //this.results[i]=this.results[i].AbstractText;
      console.log(this.results[i]);
      }
      if(this.typed=="trailer")
      {
      this.urlArray[i]= "https://www.youtube.com/embed/" +this.results[i].items[0].id.videoId;
      this.urlArray[i]=this.sanitizer.bypassSecurityTrustResourceUrl(this.urlArray[i]);
      }
      if(this.typed=="map")
      {
      this.urlArray[i]="https://www.google.com/maps/embed/v1/place?q=" + this.allSearch[i] + "&key=AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos"
      this.urlArray[i]=this.sanitizer.bypassSecurityTrustResourceUrl(this.urlArray[i]);
      }

      this.ELEMENT_DATA[i]={position:i,name:this.allSearch[i],url:this.urlArray[i]};//push element in the Element array 
      this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table
      //console.log(this.urlArray[i]);
}
//=====================================click on the button "SEARCH"==================================================
  onSave(input,type,choice){

  this.input=input;
  this.typed=type;
  this.choice=choice;
  this.allSearch= this.service.load(this.input);
  this.results=Array.of(this.results);
  this.allType=this.service.returnType(this.typed);
  
  /*if(this.service.error(this.input)==true)
    return;*/

  for(let i=0 ; i<this.allSearch.length;i++){

  this.apiUrl=this.service.returnURL(this.typed,this.allSearch[i])//get the url for the response of json
  console.log( this.apiUrl);
  this.http.get(this.apiUrl).toPromise().then(response => {
        this.count++;
        if(this.typed!="map")
        this.results[i]=response.json();
        this.saveUrl(i);
        this.loadPage(i);

        if(this.count==this.allSearch.length)
        {
          console.log("urlArray: " + this.urlArray);
          console.log("jsonArray: " + this.jsonArray);
        }
    });
  }
  this.pressed=true;
}
  ngOnInit() :void{}
  
}



 /*  if(type!="map")
      this.results[i]=data.json();
    // data is now an instance of type ItemsResponse, so you can do this:
    if(this.typed=="photo"){console.log(this.results[i]);
       this.results[i]=this.results[i].Image;}

      if(this.typed=="wiki"){
      //this.results[i]=this.results[i].AbstractText;
      console.log(this.results[i])
    }
    if(this.typed=="trailer")
    {
      this.results[i]= "https://www.youtube.com/embed/" +this.results[i].items[0].id.videoId;
      this.results[i]=this.sanitizer.bypassSecurityTrustResourceUrl(this.results[i]);
    }
    if(this.typed=="map")
    {
      this.results[i]="https://www.google.com/maps/embed/v1/place?q=" + this.allSearch[i] + "&key=AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos&origin=*"
      this.results[i]=this.sanitizer.bypassSecurityTrustResourceUrl(this.results[i]);
    }

     this.ELEMENT_DATA[i]={position:i,name:this.allSearch[i],url:this.results[i]};//push element in the Element array 
     this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table
     console.log(this.results[i]);
    
  });*/
  //===============================================================================================