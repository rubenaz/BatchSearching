import { APIservice } from './searching.service';
import { Component, OnInit } from '@angular/core';
import {Http,Response,HttpModule, RequestOptions, Headers,} from '@angular/http';
import {HttpClient, HttpHeaders} from '@angular/common/http'; 
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
  steamID:any[][]=[];
  responseArray:any[][]=[];
  jsonArray:any[]=[];
  results:any[]=[];//all result of the api
  ELEMENT_DATA: Element[][];
  otherColumn:any[][];
  displayedColumns = ['name','url','otherSearch'];
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
  finish
  nameOfColum
  minus
  cors
  error
  changeCheckBox
  temp
  
 // https://cors-anywhere.herokuapp.com/
 // http://cors-proxy.htmldriven.com/?url=
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


  this.finish=true;
  this.displayedColumns = ['name', 'url','otherSearch'];
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
  this.steamID=this.service.generate(this.steamID,this.allSearch.length);
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
  this.nameOfColum=['item']
  this.minus=true
  this.error;
  this.cors
  this.changeCheckBox=false;

    this.http.get("https://cors.io/?https://api.duckduckgo.com/?q=!g paris" ).subscribe(
       (err) =>  this.error=err); 
       
    
    if(this.error=="503")
      this.cors="https://cors-anywhere.herokuapp.com/"
    else
      this.cors="https://cors.io/?"

  


  for(let i=0;i<this.allSearch.length;i++)
  {
    this.searchUrl[i]=this.cors + "https://api.duckduckgo.com/?q=!g " + this.allSearch[i] + "&format=json";
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
  if(this.typed=="film"){
      this.nameOfColum[this.nameOfColum.length]="trailer";
      this.nameOfColum[this.nameOfColum.length]=this.typed;
      }
  else if (this.typed=="game")
      {
        this.nameOfColum[this.nameOfColum.length]=this.typed;
        this.nameOfColum[this.nameOfColum.length]="trailer";
      }
  else 
        this.nameOfColum[this.nameOfColum.length]=this.typed;

  this.displayedColumns=this.service.getColums(this.typed);
  console.log("in the first if: " + this.typed);
  this.count=0;
  this.steamResponse=0;
  this.filmResponse=0;
  for(let i=0 ; i<this.allSearch.length;i++)
  {

    this.apiUrl[i]=this.service.returnURL(this.typed,this.allSearch[i],this.cors)//get the url for the response of json
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
          if(this.service.findSteamID(this.results[i]._body)!=null){
              this.steamID[i][this.countOfColums]=this.service.findSteamID(this.results[i]._body);
              console.log("this steam id = " + this.steamID[i]);
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
  console.log("in load page " + this.countOfColums)
//====================================================PHOTO======================================================================================
      if(this.newType=="photo"){
        this.responseArray[i][this.countOfColums]= result.images[0].display_sizes[0].uri
        this.otherColumn[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustHtml('<img width="200" height="200" frameborder="0" style="border:0" src=\"'+ this.responseArray[i][this.countOfColums] + '\"allowfullscreen>');
        this.ELEMENT_DATA[i][this.countOfColums]={position:i,name:this.allSearch[i],url:this.responseArray[i][this.countOfColums],otherColumns:this.otherColumn[i][this.countOfColums]};//push element in the Element array 
        if(this.count==this.allSearch.length)
        {
        this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);
        this.finish=true;
        this.flag=true;
        if(this.changeCheckBox==true)
                    this.countOfColums=this.temp
        }
      }
//===========================================SONG VIDEO TRAILER ========================================================================================
      if(this.typed=="song" || this.newType=="song" || this.newType=="trailer" || this.newType=="video")
      {
        if(this.plus==false || this.newType=="song" ||this.newType=="trailer" || this.newType=="video")
        this.responseArray[i][this.countOfColums]= "https://www.youtube.com/embed/" +result.items[0].id.videoId;
        if(this.typed=="song" && this.plus==false)
          this.responseArray[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustResourceUrl(this.responseArray[i][this.countOfColums]);
        else
          this.otherColumn[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustHtml('<iframe width="400" height="200" frameborder="0" style="border:0" src=\"'+ this.responseArray[i][this.countOfColums] + '\"allowfullscreen></iframe>');
        this.ELEMENT_DATA[i][this.countOfColums]={position:i,name:this.allSearch[i],url:this.responseArray[i][this.countOfColums],otherColumns:this.otherColumn[i][this.countOfColums]};        if(this.count==this.allSearch.length)
        if(this.count==this.allSearch.length)
        {
        this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);
        this.finish=true;
        this.flag=true;
        if(this.changeCheckBox==true)
                    this.countOfColums=this.temp
        }
        
      }
//==============================================WIKIPEDIA=====================================================================================

     if(this.typed=="wiki" || this.newType=="wikipedia"){
       if(result[2]=="")
          result[2]="THERE ISN'T RESULT FOR THIS RESEARCH"
       this.responseArray[i][this.countOfColums]=result[2];
       if(this.newType=="wikipedia")
        this.otherColumn[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustHtml(result[2]);
       this.ELEMENT_DATA[i][this.countOfColums]={position:i,name:this.allSearch[i],url:this.responseArray[i][this.countOfColums],otherColumns:this.otherColumn[i][this.countOfColums]};//push element in the Element array 
       if(this.count==this.allSearch.length)
       {
        this.flag=true;
       this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);
       this.finish=true;
       if(this.changeCheckBox==true)
                    this.countOfColums=this.temp
       }
     }
//=======================================================FILM OR IMDB ======================================================================
      if(this.typed=="film"||this.newType=="imdb")
      {
      if(this.newType!="imdb" && this.plus==false){
        this.responseArray[i][this.countOfColums]= "https://www.youtube.com/embed/" +result.items[0].id.videoId;
        this.responseArray[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustResourceUrl(this.responseArray[i][this.countOfColums]);
      }
        this.http.get(this.cors + "https://api.themoviedb.org/3/search/movie?api_key=9949ee3ad75fde21364a3c248c3284f3&query=" + this.allSearch[i] + " " + this.keyword +"&language=en").toPromise().then(response => {
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
                this.finish=true;
                this.flag=true;
                if(this.changeCheckBox==true)
                    this.countOfColums=this.temp
            }
        });
      }
//====================================================MAP MAP MAP ===============================================================================

      if(this.typed=="map" || this.newType=="map")//this.newType is for the button + to know if i push on or no and if the type that i search is map
      {   
            if((this.typed=="map"&& this.plus==false) || this.newType=="map")
            this.http.get(this.cors +"https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos&placeid=" + result.results[0].place_id).toPromise().then(response => {
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
                this.finish=true;
                  this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table
                  this.flag=true;
                  if(this.changeCheckBox==true)
                    this.countOfColums=this.temp

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
        this.flag=true;
        this.finish=true;
        if(this.changeCheckBox==true)
                    this.countOfColums=this.temp
                
        // });//push element in the Element array 
      }
//======================================================GAME=======================================================================================
      if(this.typed=="game" ||  this.newType=="game")
      {   if(this.steamID[i][this.countOfColums]==undefined)
        {
          if(this.typed=="game" && this.plus==false)
                 this.responseArray[i][this.countOfColums]=["this game doesn't extist in steam "];
                 else
                 this.otherColumn[i][this.countOfColums]=["this game doesn't extist in steam "];  
        }
        else
        {
          this.http.get(this.cors +"http://store.steampowered.com/api/appdetails?appids=" + this.steamID[i][this.countOfColums] +"&key=B458483E2C76C8BE13EB05C37106916A&format=json").toPromise().then(response => {
            let res=response.json();
            console.log(res)
            console.log(this.newType)
            console.log(res[""+this.steamID[i][this.countOfColums]].success)
            if(res[""+this.steamID[i][this.countOfColums]].success!=false)
              {
                  if(this.typed=="game" && this.plus==false)
                      this.responseArray[i][this.countOfColums]=this.service.getResultFromSteam(res[this.steamID[i][this.countOfColums]].data);
                  else if (this.newType=="game" && this.plus==true)
                      this.otherColumn[i][this.countOfColums]=this.service.getResultFromSteam(res[this.steamID[i][this.countOfColums]].data);
              }
            else
              {
                if(this.typed=="game" && this.plus==false)
                 this.responseArray[i][this.countOfColums]=["this game doesn't extist in steam "];
                 else
                 this.otherColumn[i][this.countOfColums]=["this game doesn't extist in steam "];              
              }
            this.http.get("https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + this.allSearch[i] +" "+ "trailer"+"&key=AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos").toPromise().then(response => {
                this.steamResponse++;
                if(this.plus==false)
                {
                let youtube_result=response.json();
                this.otherColumn[i][this.countOfColums]= "https://www.youtube.com/embed/" +youtube_result.items[0].id.videoId;
                this.otherColumn[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustResourceUrl(this.otherColumn[i][this.countOfColums]);
                }
                this.ELEMENT_DATA[i][this.countOfColums]={position:i,name:this.allSearch[i],url:this.responseArray[i][this.countOfColums],otherColumns:this.otherColumn[i][this.countOfColums]};//push element in the Element array 
            
                 if(this.steamResponse==this.allSearch.length){
                   this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//push into the table*/
                   this.flag=true;
                  this.finish=true;   
                  if(this.changeCheckBox==true)
                    this.countOfColums=this.temp             
                  }
                 
             });
          });
   
      }
    }
     console.log(this.ELEMENT_DATA)
    }


//===================================================================================================================================
//===================================================================================================================================
//click on the button "+"
  add(keyword,selectType,flag,col)
  {

    if(this.pressed!=true)
    return;
    this.changeCheckBox=flag
    let options
    this.finish=false;
    this.plus=true;
    this.count=0;
    console.log(selectType);
    this.newType=selectType;
    this.keyword=keyword;
        console.log(this.countOfColums)

    if(selectType=="map")
      this.mapResponse=0;
    if(selectType=="imdb")
      this.filmResponse=0;
    if(selectType=="game")
      this.steamResponse=0;

    if(flag==false){
      console.log("here")
      this.countOfColums++;
      this.nameOfColum[this.nameOfColum.length]= selectType + " \n" + keyword
      this.displayedColumns[this.displayedColumns.length-1]='otherSearch'+ (this.countOfColums);
      this.displayedColumns[this.displayedColumns.length]='add'
    }
    else
    {
      console.log("in the else")
      col=col.slice(-1);
      col=Number(col)
      console.log("col : " +col)
      if(this.typed=="film" || this.typed=="game")
        this.nameOfColum[2+col]=selectType
      else
        this.nameOfColum[1+col]=selectType
      this.temp = this.countOfColums;
      this.countOfColums=col
    }
    console.log( "count " + this.countOfColums)
    
    for(let i=0; i<this.allSearch.length;i++)
    {    

      this.addApiUrl[i]=this.service.returnURL(selectType,this.allSearch[i]+" " +keyword,this.cors);
            console.log(this.addApiUrl[i])
        if(selectType=="photo")
        {
            options = new RequestOptions({
            headers: new Headers({
              'Accept': 'application/json','Api-Key': '78bseah6sqfmza2547zkt4y3'
            })
          });
        }
        console.log( "count " + this.countOfColums)
      this.http.get(this.addApiUrl[i],options).toPromise().then(response => 
        {
          console.log(response)
          if (selectType=="game")
          {
            let result:any;
            result=response;
            if(this.service.findSteamID(result._body)!=null){
              this.steamID[i][this.countOfColums]=this.service.findSteamID(result._body);
                console.log("this steam id = " + this.steamID[i]);
                this.addResult[i]=this.steamID[i][this.countOfColums]
            }
            else this.addResult[i]=0;
          }
          else
            this.addResult[i]=response.json()
            console.log( "before the function " + this.countOfColums)

          this.loadPage(i,this.addResult[i]);
        });
        console.log(this.displayedColumns)

    }
    console.log(this.countOfColums)
  }
  //==============================================RETURN NAME OF COLUMN=================================================================
  returncol(i)
  {
    return "otherSearch" + i + ""; 
  }
    //==============================================CREATE RANGE FOR COLUMN=================================================================

  createRange(number)
  {
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }
  //==============================================DELETE COLUMN=================================================================


  deleteColumn(name_of_col)
  {
    console.log(this.ELEMENT_DATA,this.otherColumn,this.responseArray)
    
    this.minus=false;
    let col=name_of_col.slice(-1);
    col=Number(col)
    let array2=this.nameOfColum
    let elementArray=this.ELEMENT_DATA;
    let otherCol=this.otherColumn
    let response=this.responseArray
    let begin
    if(this.typed=="film" || this.typed=="game")
      begin=2+col
    else
      begin=1+col
    
    for(let i=begin;i<this.nameOfColum.length;i++)//update the array name fo columns and the id of each column
    {
      if(i+1<=this.nameOfColum.length)
          this.nameOfColum[i]=array2[i+1]
    }
          this.nameOfColum.length--;

    console.log("numToDelete:" + col + "     numOfColums:" + this.countOfColums)
    for(let i=0;i<this.allSearch.length;i++)//update the database
    {
      
      for(let j=col;j<=this.countOfColums;j++)
      {
        
        console.log(j+1)
       // console.log(this.countOfColums)
            if(j+1<=this.countOfColums)
            {
              this.otherColumn[i][j]=otherCol[i][j+1];
              this.responseArray[i][j]=response[i][j+1]
              this.ELEMENT_DATA[i][j]=elementArray[i][j+1]
            }
      }
      this.otherColumn[i].length--;
      this.responseArray[i].length--;
      this.ELEMENT_DATA[i].length--;
    }
    this.countOfColums--;
    this.displayedColumns.length--;
    this.displayedColumns[this.displayedColumns.length-1]='add'
    this.minus=true

    console.log(this.ELEMENT_DATA,this.otherColumn,this.responseArray)
  }
  ngOnInit() :void{}
}

  //===============================================================================================