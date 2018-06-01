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
import * as cors from 'cors'
import {Router, ActivatedRoute, Params} from '@angular/router';



export interface Element {
  position: number;
  name: string;
  url: string;
  otherColumns:any[][];
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
  responseArray:any[][]=[];
  jsonArray:any[]=[];
  results:any[]=[];//all result of the api
  ELEMENT_DATA: Element[][];
  otherColumn:any[][];
  displayedColumns = ['name','url'];
  dataSource;//= new MatTableDataSource(this.ELEMENT_DATA);
  allSearch:string[];//all the search of the user
  allType:number[];//each type of each search
  falseInput=false;
  count=0
  count2=0;
  countSendUrls=0;
  steamResponse=0;
  filmResponse=0;
  flagGame=true
  typed=""
  countOfColums
  searchUrl:any[]=[]
  mapResponse
  plus=false
  htmlStr
  finalHtml
  newType
  flag
  addApiUrl
  addResult
  countWait
  keyword
  
  public href: string = "";
  private service=new APIservice();
  
  /*const functions = require('firebase-functions');
  const admin = require('firebase-admin');
  admin.initializeApp(functions.config().firebase);
  exports.notifyUser = functions.https.onRequest((req, res) => {
    console.log("hahahhahahaha")
        this.onSave(req);
    // ...
  });*/


//==================================================================================================================
  
  constructor(private http:Http,private sanitizer: DomSanitizer,private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe((params: Params) => { 
      let date = params['q'];
      if(date!=null)
        this.onSave(date);
       // Print the parameter to the console. 
  });
    
  } 
 
//============================FUNCTIONS==========================================================================
//=====================================click on the button "SEARCH"==================================================
onSave(input){
  
  if(input=="")
    return;



  this.displayedColumns = ['name', 'url'];
  this.steamID=[];
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
  this.otherColumn=this.service.generate(this.otherColumn,this.allSearch.length);
  this.ELEMENT_DATA=this.service.generate(this.ELEMENT_DATA,this.allSearch.length);
  this.responseArray=this.service.generate(this.responseArray,this.allSearch.length);
  this.results=
  this.results=Array.of(this.results);
  this.countOfColums=0;
  this.mapResponse=0;
  this.htmlStr=[];
  this.finalHtml=[]
  this.plus=false;
  this.flag=false;
  this.addApiUrl=[];
  this.addResult=[]
  this.keyword=""
  this.newType=""
  

  


  for(let i=0;i<this.allSearch.length;i++)
  {
    this.searchUrl[i]="https://cors.io/?https://api.duckduckgo.com/?q=!g " + this.allSearch[i] + "&format=json";
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
      //console.log(response.json());
        if(/*this.typed!="map" && */this.typed!="direction" && this.typed!="game")
          this.results[i]=response.json();
        else if (this.typed=="game")
        {
          this.results[i]=response;
          //console.log(response);
          if(this.service.regex(this.results[i]._body)!=null){
              this.steamID[i]=this.service.regex(this.results[i]._body);console.log("this steam id = " + this.steamID[i]);
          }
          else
            this.flagGame=false;
        }
        this.loadPage(i,this.results[i]);
        this.pressed=true;
    });
  
  }
}
//========================================================================================================================================
public loadPage(i,result)
{
  this.count++;
//====================================================PHOTO======================================================================================
      if(this.newType=="photo"){
        this.responseArray[i][this.countOfColums]= "https://farm" + result.photos.photo[0].farm + ".staticflickr.com/" + result.photos.photo[0].server+
         "/" + result.photos.photo[0].id +"_" + result.photos.photo[0].secret +".jpg"
         console.log(this.responseArray[i]);     
        //this.responseArray[i]=this.results[i].Image;
                this.ELEMENT_DATA[i][this.countOfColums]={position:i,name:this.allSearch[i],url:this.responseArray[i][this.countOfColums],otherColumns:this.otherColumn[i][this.countOfColums]};//push element in the Element array 
        this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table
      }
//===========================================SONG VIDEO TRAILER ========================================================================================
      if(this.typed=="song" || this.newType=="song" || this.newType=="trailer" || this.newType=="video")
      {
        if(this.plus==false || this.newType=="song" ||this.newType=="trailer" || this.newType=="video")
        this.responseArray[i][this.countOfColums]= "https://www.youtube.com/embed/" +result.items[0].id.videoId;
        if(this.typed=="song" && this.plus==false)
          this.responseArray[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustResourceUrl(this.responseArray[i][this.countOfColums]);
        else
          this.otherColumn[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustHtml('<iframe width="200" height="200" frameborder="0" style="border:0" src=\"'+ this.responseArray[i][this.countOfColums] + '\"allowfullscreen></iframe>');
        this.ELEMENT_DATA[i][this.countOfColums]={position:i,name:this.allSearch[i],url:this.responseArray[i][this.countOfColums],otherColumns:this.otherColumn[i][this.countOfColums]};
        this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);
        this.flag=true;
      }
//==============================================WIKIPEDIA=====================================================================================

     if(this.typed=="wiki" || this.newType=="wikipedia"){
       if(result[2]=="")
          result[2]="THERE ISN'T RESULT FOR THIS RESEARCH"
       this.responseArray[i][this.countOfColums]=result[2];
       if(this.newType=="wikipedia")
        this.otherColumn[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustHtml(result[2]);
       this.ELEMENT_DATA[i][this.countOfColums]={position:i,name:this.allSearch[i],url:this.responseArray[i][this.countOfColums],otherColumns:this.otherColumn[i][this.countOfColums]};//push element in the Element array 
       this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);
      }
//=======================================================FILM OR IMDB ======================================================================
      if(this.typed=="film"||this.newType=="imdb")
      {
      if(this.newType!="imdb" && this.plus==false){
        this.responseArray[i][this.countOfColums]= "https://www.youtube.com/embed/" +result.items[0].id.videoId;
        this.responseArray[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustResourceUrl(this.responseArray[i][this.countOfColums]);
      }
        this.http.get("https://cors.io/?https://api.themoviedb.org/3/search/movie?api_key=9949ee3ad75fde21364a3c248c3284f3&query=" + this.allSearch[i] + " " + this.keyword +"&language=en").toPromise().then(response => {
          let res=response.json();
          if(this.newType!="imdb" && this.plus==false)
            this.otherColumn[i][this.countOfColums]=this.service.getResultFromFilm(res);
          let str="<ul>"
          if(this.newType=="imdb")
          {
            this.otherColumn[i][this.countOfColums]=this.service.getResultFromFilm(res);
            if(this.otherColumn[i][this.countOfColums].length==1)
                str+='<li>'+this.otherColumn[i][this.countOfColums][0]+'</li>'
          else
            {
            for(let j = 0;j<6 ; j ++)
              str+='<li>'+this.otherColumn[i][this.countOfColums][j] +'</li>'
              str+="<ul>"
            }
            this.otherColumn[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustHtml(str)
          } 
          this.filmResponse++;
          this.ELEMENT_DATA[i][this.countOfColums]={position:i,name:this.allSearch[i],url:this.responseArray[i][this.countOfColums],otherColumns:this.otherColumn[i][this.countOfColums]};
            if(this.filmResponse==this.allSearch.length)
            {
                this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table
                this.flag=true;
            }
        });
      }
//====================================================MAP MAP MAP ===============================================================================

      if(this.typed=="map" || this.newType=="map")//this.newType is for the button + to know if i push on or no and if the type that i search is map
      {     
            if((this.typed=="map"&& this.plus==false) || this.newType=="map")
            this.http.get("https://cors.io/?https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos&placeid=" + result.results[0].place_id).toPromise().then(response => {
            let res=response.json();
            this.mapResponse++;
            this.responseArray[i][this.countOfColums]=res.result.url+"&output=embed";
            if(this.newType!="map")
              this.responseArray[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustResourceUrl(this.responseArray[i][this.countOfColums]);
            console.log(this.responseArray[i][this.countOfColums])
            if(this.newType=="map")
              this.otherColumn[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustHtml('<iframe width="200" height="200" frameborder="0" style="border:0" src=\"'+ this.responseArray[i][this.countOfColums] + '\"allowfullscreen></iframe>');
              this.ELEMENT_DATA[i][this.countOfColums]={position:i,name:this.allSearch[i],url:this.responseArray[i][this.countOfColums],otherColumns:this.otherColumn[i][this.countOfColums]};//push element in the Element array 
              if(this.mapResponse==this.allSearch.length)
              {//if get all the answer of the server
                  this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table
                  this.flag=true;
              }              
        });
      }
//======================================================DIRECTION=================================================================================

       if (this.typed=="direction" || this.newType=="direction")
      {
       // this.http.get("https://cors.io/?https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos&origin=" + this.results[i].geocoded_waypoints[0].place_id + "&destination=" +this.results[i].geocoded_waypoints[1].place_id ).toPromise().then(response => {
        this.responseArray[i][this.countOfColums]=this.apiUrl[i];
        this.responseArray[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustResourceUrl(this.responseArray[i][this.countOfColums]);
        this.ELEMENT_DATA[i][this.countOfColums]={position:i,name:this.allSearch[i],url:this.responseArray[i][this.countOfColums],otherColumns:this.otherColumn[i][this.countOfColums]};
        this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);

        // });//push element in the Element array 
      }
//======================================================GAME=======================================================================================
      if(this.typed=="game" ||  this.newType=="game")
      {
        if(this.flagGame==true){
          this.http.get("https://cors.io/?http://store.steampowered.com/api/appdetails?appids=" + this.steamID[i] +"&key=B458483E2C76C8BE13EB05C37106916A&format=json").toPromise().then(response => {
            let result=response.json();
            console.log(result)
            console.log(result[""+this.steamID[i]].success)
            if(result[""+this.steamID[i]].success!=false)
                 this.responseArray[i][this.countOfColums]=this.service.getResultFromSteam(result[this.steamID[i]].data);
            else
                 this.responseArray[i][this.countOfColums]=["this game doesn't extist in steam "];
            this.http.get("https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + this.allSearch[i] +" "+ "trailer"+"&key=AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos").toPromise().then(response => {
                this.steamResponse++;
                let youtube_result=response.json();
                this.otherColumn[i][this.countOfColums]= "https://www.youtube.com/embed/" +youtube_result.items[0].id.videoId;
                this.otherColumn[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustResourceUrl(this.otherColumn[i][this.countOfColums]);
                if(this.plus==false)
                {
                this.ELEMENT_DATA[i][this.countOfColums]={position:i,name:this.allSearch[i],url:this.responseArray[i][this.countOfColums],otherColumns:this.otherColumn[i][this.countOfColums]};//push element in the Element array 
            
                 if(this.steamResponse==this.allSearch.length){
                   this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table*/
                   this.flag=true;}
                 }
             });
          });
        }
        else
        {
           this.responseArray[i][this.countOfColums] =["this game doesn't extist in steam "];
           this.steamResponse++;
        }
      
      }
      
     console.log(this.ELEMENT_DATA)
    }


//===================================================================================================================================
//===================================================================================================================================
//click on the button "+"
  add(keyword,selectType)
  {
    console.log(selectType);
    this.newType=selectType;
    this.keyword=keyword;
    if(this.pressed!=true)
      return;
    if(selectType=="map")
      this.mapResponse=0;
    if(selectType=="imdb")
      this.filmResponse=0;

    this.countOfColums++;
    this.displayedColumns[this.displayedColumns.length]='otherSearch'+ (this.countOfColums);
    for(let i=0; i<this.allSearch.length;i++)
    {
      this.addApiUrl[i]=this.service.returnURL(selectType,this.allSearch[i]+" " +keyword);
            console.log(this.addApiUrl[i])
      this.http.get(this.addApiUrl[i]).toPromise().then(response => 
        {
            console.log(response.json());
            this.addResult[i]=response.json();
            this.loadPage(i,this.addResult[i]);
        });
        this.plus=true;
    }
    
  }
  returncol(i)
  {
    return "otherSearch" + i + ""; 
  }
  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }


  ngOnInit() :void{}
}

  //===============================================================================================