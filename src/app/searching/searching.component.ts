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
  private apiUrl:any[]=[];
  pressed=false;
  steamID:any[]=[];
  responseArray:any[]=[];
  jsonArray:any[]=[];
  results:any[]=[];//all result of the api
  ELEMENT_DATA: Element[] =[]// [{position: 1, name: 'Hydrogen', url:'https://duckduckgo.com/i/7dceb552.jpg'}];
  displayedColumns = ['position', 'name', 'url'];
  dataSource;//= new MatTableDataSource(this.ELEMENT_DATA);
  allSearch:string[];//all the search of the user
  allType:number[];//each type of each search
  falseInput=false;
  count=0;
  countSendUrls=0;
  steamResponse=false;
  flagGame=true;
  typed="";
  choice="";
  searchUrl:any[]=[];
  
  private service=new APIservice();

//==================================================================================================================
  
  constructor(private http:Http,private sanitizer: DomSanitizer) {} 

//============================FUNCTIONS==========================================================================
public saveUrl(i)
{
  this.jsonArray[i]=this.results[i];
}
//=====================================================================================================================
public  getAnswer(){
  this.typed=this.service.getFinalType(this.allType);
  console.log("in the first if: " + this.typed);
  for(let i=0 ; i<this.allSearch.length;i++)
  {

    this.apiUrl[i]=this.service.returnURL(this.typed,this.allSearch[i])//get the url for the response of json
    console.log("in the second for " +  this.apiUrl[i]);
    this.http.get(this.apiUrl[i]).toPromise().then(response => 
    {
        this.count++;

        if(this.typed!="map" && this.typed!="direction" && this.typed!="game")
          this.results[i]=response.json();
        else if (this.typed=="game")
        {
          this.results[i]=response;
          if(this.service.regex(this.results[i]._body)!=null)
              this.steamID[i]=this.service.regex(this.results[i]._body);
          else
            this.flagGame=false;
        }
        this.saveUrl(i);
        this.loadPage(i);
        this.pressed=true;
    });
  
  }
}
//========================================================================================================================================
public loadPage(i)
{
      if(this.typed=="photo"){
        this.responseArray[i]=this.results[i].Image;
        this.ELEMENT_DATA[i]={position:i,name:this.allSearch[i],url:this.responseArray[i]};//push element in the Element array 
        this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table
      }

     else if(this.typed=="wiki"){
       this.responseArray[i]=this.results[i][2];
       this.ELEMENT_DATA[i]={position:i,name:this.allSearch[i],url:this.responseArray[i]};//push element in the Element array 
       this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table
      //console.log(this.results[i]);
      }
      else if(this.typed=="trailer")
      {
      this.responseArray[i]= "https://www.youtube.com/embed/" +this.results[i].items[0].id.videoId;
      this.responseArray[i]=this.sanitizer.bypassSecurityTrustResourceUrl(this.responseArray[i]);
      this.ELEMENT_DATA[i]={position:i,name:this.allSearch[i],url:this.responseArray[i]};//push element in the Element array 
      this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table
      }
      else if(this.typed=="map")
      {
      this.responseArray[i]="https://www.google.com/maps/embed/v1/place?q=" + this.allSearch[i] + "&key=AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos"
      this.responseArray[i]=this.sanitizer.bypassSecurityTrustResourceUrl(this.responseArray[i]);
      this.ELEMENT_DATA[i]={position:i,name:this.allSearch[i],url:this.responseArray[i]};//push element in the Element array 
      this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table
      }
      else if (this.typed=="direction")
      {
        this.responseArray[i]=this.apiUrl[i];
        this.responseArray[i]=this.sanitizer.bypassSecurityTrustResourceUrl(this.responseArray[i]);
        this.ELEMENT_DATA[i]={position:i,name:this.allSearch[i],url:this.responseArray[i]};//push element in the Element array 
        this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table
       // console.log(this.responseArray[i]);
      }
      else if(this.typed=="game")
      {
        if(this.flagGame==true){
          this.http.get("http://store.steampowered.com/api/appdetails?appids=" + this.steamID[i] +"&key=B458483E2C76C8BE13EB05C37106916A&format=json").toPromise().then(response => {
          let result=response.json();
         // console.log(result[this.steamID[i]].data);
          this.responseArray[i]=this.service.getResultFromSteam(result[this.steamID[i]].data);
          this.ELEMENT_DATA[i]={position:i,name:this.allSearch[i],url:this.responseArray[i]};//push element in the Element array 
          this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table
          this.steamResponse=true; 
      });
    }
    else
    this.responseArray[i]=["this game doesn't extist"];
      
      }
      else if(this.typed=="film")
      {
        if(this.results[i].results[0].original_language!=null && 
          this.results[i].results[0].original_title!=null &&
           this.results[i].results[0].overview!=null &&
           this.results[i].results[0].popularity!=null &&
           this.results[i].results[0].release_date !=null && 
           this.results[i].results[0].vote_average!= null){
          this.responseArray[i]=["original_language: " +this.results[i].results[0].original_language,
                            "original_title: " + this.results[i].results[0].original_title,
                            "overview: " + this.results[i].results[0].overview,
                            "popularity: " + this.results[i].results[0].popularity,
                            "release_date: " +this.results[i].results[0].release_date,
                            "vote_average: " +this.results[i].results[0].vote_average
                          ]
                        }
                        else 
                        this.responseArray[i]="This film doesn't exist !!!!!!!";
                        
          this.ELEMENT_DATA[i]={position:i,name:this.allSearch[i],url:this.responseArray[i]};//push element in the Element array 
          this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table

      }
     // console.log(this.responseArray[i]);
}
//=====================================click on the button "SEARCH"==================================================
  onSave(input,type,choice){

  this.ELEMENT_DATA=[];
  this.responseArray=[];
  this.allType=[];
  this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);
  this.input=input;
  this.count=0;
  this.countSendUrls=0;
  this.flagGame=true;
  this.steamResponse=false;
  this.service.clearTheArrayType()
  //this.typed=type;
  this.choice=choice;
  this.allSearch= this.service.load(this.input);
  this.results=[];
  this.results=Array.of(this.results);


  for(let j=0;j<this.allSearch.length;j++)
  {
    this.searchUrl[j]="http://api.duckduckgo.com/?q=!g " + this.allSearch[j] + "&format=json";
    console.log("the first for :" + this.searchUrl[j]);
    this.http.get(this.searchUrl[j]).toPromise().then(response => 
    {
      console.log("in the first get");
      this.allType=this.service.getType(response,input);
      console.log(this.allType);
      this.countSendUrls++;
      if(this.countSendUrls==this.allSearch.length){
        console.log("finish to get the type")
         this.getAnswer();}
    });

  }
}


  ngOnInit() :void{}
  
}
  //===============================================================================================