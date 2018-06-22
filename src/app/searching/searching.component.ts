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

//this compoment is the main of the project all the basic function like  the push on the button or  push on the button + or - 
//the most important function in is component is : LoadPage. this function is the save
// of the database after that the User push on the button and after he pushed the + button  

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
  
  input;//the input of the user
  private apiUrl:any[]=[];//api url i need to use after the button search pushed
  pressed=false;//flag to the button "search"
  steamID:any[][]=[];//array of ID Of games
  responseArray:any[][]=[];//the database 
  results:any[]=[];//all result of the api
  ELEMENT_DATA: Element[][];//element who represente how the table need to show
  otherColumn:any[][];//database of the added colum 
  displayedColumns = ['name','url','otherSearch'];
  dataSource;//= new MatTableDataSource(this.ELEMENT_DATA);
  allSearch:string[];//all the search of the user
  allType:number[];//each type of each search
  falseInput=false;//flag to false input
  count=0//to count how many response of item from the request 
  countSendUrls=0;//how many url i sended to search
  steamResponse=0;//steam response i received
  filmResponse=0;//film response i recevied
  flagGame=true//if game doesent exist 
  typed=""//the type of the research from the user
  countOfColums//num of columns in the table
  searchUrl:any[]=[]//array from url - searchUrl[0] represent the url of the first item
  mapResponse//num of map response i received
  plus=false//flag to the button + 
  newType//the new type that the user choosed
  flag//
  addApiUrl//api url i need to use after the button + pushed
  addResult//resutl after added column
  keyword//the keyword that the user enterd
  finish//flag that after the push on + all responses received from http request 
  nameOfColum//array represent the header bar of the table
  minus//flag for the push on - 
  cors//begin of the html from debug the bug cors
  error//if serv of cors not work this is the error that we receive from the serv
  changeCheckBox//flag if i change the check box fron column thad i added 
  temp// to save the number of added columns to know what column i need to change after the change of the checkbox
  
 // https://cors-anywhere.herokuapp.com/
 // http://cors-proxy.htmldriven.com/?url=
  public href: string = "";
  private service=new APIservice();
  


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
  this.plus=false;
  this.flag=false;
  this.addApiUrl=[];
  this.addResult=[]
  this.keyword=""
  this.newType=""
  this.nameOfColum=['Item']
  this.minus=true
  this.error;
  this.cors=""
  this.changeCheckBox=false;

   /* this.http.get("https://cors.io/?https://api.duckduckgo.com/?q=!g paris" ).subscribe(//need to check if the server cors.io is availble
       (err) =>  this.error=err); 
       
    
    if(this.error=="503")//if is not availble use other server
      this.cors="https://cors-anywhere.herokuapp.com/"
    else
      this.cors="https://cors.io/?"

  */


  for(let i=0;i<this.allSearch.length;i++)//first for to know what is the type of research that the user need
  {
    this.searchUrl[i]=this.cors + "https://api.duckduckgo.com/?q=!g " + this.allSearch[i] + "&format=json";//use the api of duckduckgo and the bang to get result from google

    this.http.get(this.searchUrl[i]).toPromise().then(response => 
    {
      //request to get response 
      this.allType=this.service.getType(response,this.allSearch[i]);//use service fonction to get the array of type of the research
      console.log(this.allType)
      this.countSendUrls++;//update the count after receive response from the server
      if(this.countSendUrls==this.allSearch.length){//if receive all the response go to the getAnswer Response
         this.getAnswer();}
    });

  }
}

//=====================================================================================================================
public  getAnswer(){//get the url of each item 
  this.typed=this.service.getFinalType(this.allType);//get the final type 
  if(this.typed=="film"){//if the type is film the header of the table is :
      this.nameOfColum[this.nameOfColum.length]="Trailer";
      this.nameOfColum[this.nameOfColum.length]=this.typed[0].toUpperCase() + this.typed.slice(1);
      }
  else if (this.typed=="game")//if the type is game the header of the table is :
      {
        this.nameOfColum[this.nameOfColum.length]=this.typed[0].toUpperCase() + this.typed.slice(1);
        this.nameOfColum[this.nameOfColum.length]="Trailer";
      }
  else 
        this.nameOfColum[this.nameOfColum.length]=this.typed[0].toUpperCase() + this.typed.slice(1);

  this.displayedColumns=this.service.getColums(this.typed);//get title of each column (database )

  this.count=0;
  this.steamResponse=0;
  this.filmResponse=0;

  for(let i=0 ; i<this.allSearch.length;i++)
  {

    this.apiUrl[i]=this.service.returnURL(this.typed,this.allSearch[i],this.cors)//get the url for the response of json
    this.http.get(this.apiUrl[i]).toPromise().then(response => 
    {
      
        if(this.typed!="game" && this.typed!="direction")//if the type is game i need to seek in google the id of the game so I make search in duckducgo and use api of steam 
          this.results[i]=response.json();
        else if (this.typed=="game")
        {
          this.results[i]=response;
          if(this.service.findSteamID(this.results[i]._body)!=null){//get the id of this game (search duckduckgo)
              this.steamID[i][this.countOfColums]=this.service.findSteamID(this.results[i]._body);
          }
          else// if the game doesnt exist
            this.flagGame=false;
        }
        this.loadPage(i,this.results[i]);//go to loadpage 
        this.pressed=true;
    });
  
  }
}
//========================================================================================================================================
public loadPage(i,result)//fill the database in this function : type is the type from the authentifacation automatic
// and newType if after the user add column
//responseArray is the database of the automatic authentification 
//othercolumn is the db  of the added column
{
  this.count++;
//====================================================PHOTO======================================================================================
      if(this.newType=="photo"){
        this.responseArray[i][this.countOfColums]= result.images[0].display_sizes[0].uri
        this.otherColumn[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustHtml('<img  width="100%" height="100%" frameborder="0" style="border:0" src=\"'+ this.responseArray[i][this.countOfColums] + '\"allowfullscreen>');
        this.ELEMENT_DATA[i][this.countOfColums]={position:i,name:this.allSearch[i],url:this.responseArray[i][this.countOfColums],otherColumns:this.otherColumn[i][this.countOfColums]};//push element in the Element array 
        if(this.count==this.allSearch.length)
        {
        this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);//get into the table 
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
          this.otherColumn[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustHtml('<iframe  width="100%" height="100%" frameborder="0" style="border:0" src=\"'+ this.responseArray[i][this.countOfColums] + '\"allowfullscreen></iframe>');
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

     if(this.typed=="wikipedia" || this.newType=="wikipedia"){
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
            if(this.newType=="map")
              this.otherColumn[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustHtml('<iframe  width="100%" height="100%" frameborder="0" style="border:0" src=\"'+ this.responseArray[i][this.countOfColums] + '\"allowfullscreen></iframe>');
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
       if(this.typed=="direction" && this.plus==false) {
       this.responseArray[i][this.countOfColums]=this.apiUrl[i];
        this.responseArray[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustResourceUrl(this.responseArray[i][this.countOfColums]);
       }
       else
       {
        this.otherColumn[i][this.countOfColums]=this.addApiUrl[i];
        this.otherColumn[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustResourceUrl(this.otherColumn[i][this.countOfColums]);
        this.otherColumn[i][this.countOfColums]=this.sanitizer.bypassSecurityTrustHtml('<iframe  width="100%" height="100%" frameborder="0" style="border:0" src=\"'+ this.addApiUrl[i] + '\"allowfullscreen></iframe>');

       }
        this.ELEMENT_DATA[i][this.countOfColums]={position:i,name:this.allSearch[i],url:this.responseArray[i][this.countOfColums],otherColumns:this.otherColumn[i][this.countOfColums]};
        if(this.count==this.allSearch.length)
        {
        this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);
        this.flag=true;
        this.finish=true;
        if(this.changeCheckBox==true)
                    this.countOfColums=this.temp
        }  
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
    }


//===================================================================================================================================
//===================================================================================================================================
//click on the button "+"
  add(keyword,selectType,flag,col)//add the column in the table
  {
    if(selectType=="type")//if the user push on the button but didnt choose type
    {
      this.flag=true
      this.finish=true;
      return
    }
    if(this.pressed!=true)//if the user push on the button but didnt search anything
    return;
    this.changeCheckBox=flag
    let options
    this.finish=false;//to wait the response of the server
    this.plus=true;//button pushed
    this.count=0;//new serach so new count 
    this.newType=selectType;
    this.keyword=keyword;

    if(selectType=="map")
      this.mapResponse=0;//new serach so new count 
    if(selectType=="imdb")
      this.filmResponse=0;//new serach so new count 
    if(selectType=="game")
      this.steamResponse=0;//new serach so new count 

    if(flag==false){
      this.countOfColums++;
      this.nameOfColum[this.nameOfColum.length]= selectType[0].toUpperCase() + selectType.slice(1) + " \n" + keyword // name of the new column
      this.displayedColumns[this.displayedColumns.length-1]='otherSearch'+ (this.countOfColums);//database name column
      this.displayedColumns[this.displayedColumns.length]='add'//the column in the end to add new column
    }
    else
    {
      col=col.slice(-1);
      col=Number(col)
      if(this.typed=="film" || this.typed=="game")//film and game have 2 columns (trailer + film/game)
        this.nameOfColum[2+col]=selectType[0].toUpperCase() + selectType.slice(1)
      else
        this.nameOfColum[1+col]=selectType[0].toUpperCase() + selectType.slice(1)
      this.temp = this.countOfColums;//save the num of columns
      this.countOfColums=col//the col to change
    }
    
    for(let i=0; i<this.allSearch.length;i++)
    {    

      this.addApiUrl[i]=this.service.returnURL(selectType,this.allSearch[i]+" " +keyword,this.cors);//get the url for the response of json
        if(selectType=="photo")
        {//add request in the header
            options = new RequestOptions({
            headers: new Headers({
              'Accept': 'application/json','Api-Key': '78bseah6sqfmza2547zkt4y3'
            })
          });
        }
      this.http.get(this.addApiUrl[i],options).toPromise().then(response => 
        {
          if (selectType=="game")
          {
            let result:any;
            result=response;
            if(this.service.findSteamID(result._body)!=null){
              this.steamID[i][this.countOfColums]=this.service.findSteamID(result._body);
                this.addResult[i]=this.steamID[i][this.countOfColums]
            }
            else this.addResult[i]=0;
          }
          else if(selectType=="direction")
          {
            this.addResult[i]=response
          }
          else
            this.addResult[i]=response.json()

          this.loadPage(i,this.addResult[i]);
        });

    }
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


  deleteColumn(name_of_col)//delete column when the button - pressed 
  {
    
    this.minus=false;//to not showing the table in html
    let col=name_of_col.slice(-1);
    col=Number(col)//the col what I want to delete
    let array2=this.nameOfColum//to save the old name of the table
    let elementArray=this.ELEMENT_DATA;//to save the old element data
    let otherCol=this.otherColumn//to save the other column data
    let response=this.responseArray//to save the database
    let begin//to know from where I need to copy the old data to the new data
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

    for(let i=0;i<this.allSearch.length;i++)//update the database
    {
      
      for(let j=col;j<=this.countOfColums;j++)
      {
        
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

  }
  ngOnInit() :void{}
}

  //===============================================================================================