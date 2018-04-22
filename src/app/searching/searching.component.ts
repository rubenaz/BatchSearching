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
  otherColumns:any[];
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
  ELEMENT_DATA: Element[] =[]
  otherColumn:any[];
  displayedColumns = ['position', 'name', 'url'];
  dataSource;//= new MatTableDataSource(this.ELEMENT_DATA);
  allSearch:string[];//all the search of the user
  allType:number[];//each type of each search
  falseInput=false;
  count=0;
  countSendUrls=0;
  steamResponse=0;
  filmResponse=0;
  flagGame=true;
  typed="";

  searchUrl:any[]=[];
  
  private service=new APIservice();

//==================================================================================================================
  
  constructor(private http:Http,private sanitizer: DomSanitizer) {} 

//============================FUNCTIONS==========================================================================
//=====================================click on the button "SEARCH"==================================================
onSave(input){

  this.ELEMENT_DATA=[];
  this.responseArray=[];
  this.displayedColumns = ['position', 'name', 'url'];
  this.steamID=[];
  this.otherColumn=[];
  this.allType=[];
  this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);
  this.input=input;
  this.count=0;
  this.countSendUrls=0;
  this.filmResponse=0;
  this.flagGame=true;
  this.steamResponse=0;
  this.service.clearTheArrayType()
  this.allSearch= this.service.load(this.input);
  this.results=[];
  this.results=Array.of(this.results);


  for(let i=0;i<this.allSearch.length;i++)
  {
    this.searchUrl[i]="http://api.duckduckgo.com/?q=!g " + this.allSearch[i] + "&format=json";
    console.log("the first for :" + this.searchUrl[i]);
    this.http.get(this.searchUrl[i]).toPromise().then(response => 
    {
      console.log("in the first get");
      this.allType=this.service.getType(response,this.allSearch[i]);
      console.log(this.allType);
      this.countSendUrls++;
      if(this.countSendUrls==this.allSearch.length){
        console.log("finish to get the type")
         this.getAnswer();}
    });

  }
}

//=====================================================================================================================
public  getAnswer(){
  this.typed=this.service.getFinalType(this.allType);
  this.displayedColumns=this.service.getColums(this.typed);
  console.log("in the first if: " + this.typed);
  this.count=0;
  this.steamResponse=0;
  this.filmResponse=0;
  for(let i=0 ; i<this.allSearch.length;i++)
  {

    this.apiUrl[i]=this.service.returnURL(this.typed,this.allSearch[i])//get the url for the response of json
    console.log("in the second for " +  this.apiUrl[i]);
    this.http.get(this.apiUrl[i]).toPromise().then(response => 
    {
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
        this.loadPage(i);
        this.pressed=true;
    });
  
  }
}
//========================================================================================================================================
public loadPage(i)
{
  this.count++;
      if(this.typed=="photo"){
        this.responseArray[i]=this.results[i].Image;
        this.ELEMENT_DATA[i]={position:i,name:this.allSearch[i],url:this.responseArray[i],otherColumns:this.otherColumn[i]};//push element in the Element array 
        this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table
      }

     else if(this.typed=="wiki"){
       this.responseArray[i]=this.results[i][2];
       this.ELEMENT_DATA[i]={position:i,name:this.allSearch[i],url:this.responseArray[i],otherColumns:this.otherColumn[i]};//push element in the Element array 

      }
      else if(this.typed=="film")
      {
      this.responseArray[i]= "https://www.youtube.com/embed/" +this.results[i].items[0].id.videoId;
      this.responseArray[i]=this.sanitizer.bypassSecurityTrustResourceUrl(this.responseArray[i]);
      
      this.http.get("https://api.themoviedb.org/3/search/movie?api_key=9949ee3ad75fde21364a3c248c3284f3&query=" + this.allSearch[i] +"&language=en").toPromise().then(response => {
        let result=response.json();
        this.otherColumn[i]=this.service.getResultFromFilm(result);
        this.filmResponse++;
        this.ELEMENT_DATA[i]={position:i,name:this.allSearch[i],url:this.responseArray[i],otherColumns:this.otherColumn[i]};
        if(this.filmResponse==this.allSearch.length)
        //push element in the Element array 
            this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table
          
        });
      }
      else if(this.typed=="map")
      {
      this.responseArray[i]="https://www.google.com/maps/embed/v1/place?q=" + this.allSearch[i] + "&key=AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos"
      this.responseArray[i]=this.sanitizer.bypassSecurityTrustResourceUrl(this.responseArray[i]);
      this.ELEMENT_DATA[i]={position:i,name:this.allSearch[i],url:this.responseArray[i],otherColumns:this.otherColumn[i]};//push element in the Element array 
      }
      else if (this.typed=="direction")
      {
        this.responseArray[i]=this.apiUrl[i];
        this.responseArray[i]=this.sanitizer.bypassSecurityTrustResourceUrl(this.responseArray[i]);
        this.ELEMENT_DATA[i]={position:i,name:this.allSearch[i],url:this.responseArray[i],otherColumns:this.otherColumn[i]};//push element in the Element array 
      }
      else if(this.typed=="game")
      {
        if(this.flagGame==true){
          this.http.get("http://store.steampowered.com/api/appdetails?appids=" + this.steamID[i] +"&key=B458483E2C76C8BE13EB05C37106916A&format=json").toPromise().then(response => {
            let result=response.json();
            this.responseArray[i]=this.service.getResultFromSteam(result[this.steamID[i]].data);
            this.http.get("https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + this.allSearch[i] +" "+ "trailer"+"&key=AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos").toPromise().then(response => {
                this.steamResponse++;
                let youtube_result=response.json();
                this.otherColumn[i]= "https://www.youtube.com/embed/" +youtube_result.items[0].id.videoId;
                this.otherColumn[i]=this.sanitizer.bypassSecurityTrustResourceUrl(this.otherColumn[i]);
                this.ELEMENT_DATA[i]={position:i,name:this.allSearch[i],url:this.responseArray[i],otherColumns:this.otherColumn[i]};//push element in the Element array 
            
                 if(this.steamResponse==this.allSearch.length)
                   this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table*/
             });
          });
           /* this.ELEMENT_DATA[i]={position:i,name:this.allSearch[i],url:this.responseArray[i],otherColumns:this.otherColumn[i]};//push element in the Element array 
          
          if(this.steamResponse==this.allSearch.length)
            this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table*/
        }
        else
        {
           this.responseArray[i]=["this game doesn't extist"];
           this.steamResponse++;
        }
      
      }
      if(this.typed!="game" && this.typed!="film")
      {
          if(this.count==this.allSearch.length)
            this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table
        }
      }

  add(keyword,selectType)
  {
console.log(keyword,selectType);
  }

  ngOnInit() :void{}
  
}
  //===============================================================================================