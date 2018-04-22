import { SearchingComponent } from './searching.component';
import { Component } from '@angular/core';
import {Http,Response,HttpModule,} from '@angular/http';
import {HttpClientModule} from '@angular/common/http'; 
import 'rxjs/add/operator/map'
import { Injectable } from '@angular/core';
declare var require: any;

@Injectable()
export class APIservice{

    allSearch:string[];
    resultSteam:string[]=[];
    alltype:number[]=[];

     
    
    
    private apiUrl;

    constructor(){}

    error(input){
        if(input.lastIndexOf("\n")==(input.length-1))
            return true;
        return false;
         
    }

    load(input){    
        this.allSearch=input.split("\n",input.length);
        let temp:string[]=[];
        let count=0;
        for(let i=0;i<this.allSearch.length;i++)
        {
            if(this.allSearch[i]!="")
            {
                temp[count]=this.allSearch[i];
                count++;
            }
        }
        return temp;
    }
    returnURL(type,search)
    {
        let origin,destination;
        let temp=search.split(" to ",search.length);
        origin= temp[0];
        destination = temp[1];
        if(type=="film")
        {
        this.apiUrl="https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + search +" "+ type+"&key=AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos";
        }
         if (type=="photo")
        {
            this.apiUrl="http://api.duckduckgo.com/?q="; 
            this.apiUrl+=search +"&format=json&pretty=1";
        }
        else if(type=="wiki")
        {
            this.apiUrl="https://en.wikipedia.org/w/api.php?action=opensearch&search=" + search +"&limit=1&format=json&origin=*" ;
        }
        else if (type=="map")
        {
            this.apiUrl="https://www.google.com/maps/embed/v1/place?q=" + search + "&key=AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos";
        }
        else if(type=="direction")
        {  
            this.apiUrl="https://www.google.com/maps/embed/v1/directions?key=AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos&origin=" + origin +"&destination=" + destination + "&avoid=tolls|highways"
        }
        else if(type=="game")
        {            
            this.apiUrl="http://api.duckduckgo.com/?q=!steamdb " + search + "&format=json" ;
        }
        return this.apiUrl;
    }
    getPhotoUrl(jsonResponse)
    {

        let url="";
        url= "https://farm" + jsonResponse[0].farm + ".staticflickr.com/" + jsonResponse[0].server +"/" +jsonResponse[0].id +
        "_"+jsonResponse[0].secret + ".jpg"
       return  url;
    }
    regex(search)
    {
        let index;
        index=search.search("data-appid=");
        if(index==-1)
            return null;
        search=search.substring(index+12, index +20);
        search=search.replace("\"","");
        search=search.replace(">", "");

        
        return search;
    }
    getResultFromSteam(search)
    {
        let result:string[]=[];
        if(search.about_the_game!=undefined)
            result[result.length]="About the game: " + search.about_the_game;
        if(search.developers!=null && search.developers[0]!=undefined)
            result[result.length]="developers: " + search.developers[0];
        if(search.genres!=null &&search.genres[0]!=null && search.genres[0].description!=undefined )
            result[result.length]="genre: " + search.genres[0].description;
        if(search.header_image!=undefined)
            result[result.length]= search.header_image;
        if(search.legal_notice!=undefined)
        result[result.length]="legal notice: " + search.legal_notice
        if(search.release_date!=null && search.release_date.data!=undefined)
        result[result.length]="release_date: " + search.release_date.data;
        if(search.required_age!=undefined)
        result[result.length]="required_age: " + search.required_age;
        if( search.recommendations!=null)
        result[result.length]="recommendation:" + search.recommendations.total;

        return result;
 
    }
    getResultFromFilm(results)
    {
        let finalResult;

        if(results.results[0]!=null&&
            results.results[0].original_language!=null && 
        results.results[0].original_title!=null &&
         results.results[0].overview!=null &&
         results.results[0].popularity!=null &&
         results.results[0].release_date !=null && 
         results.results[0].vote_average!= null){
            finalResult=["original_language: " +results.results[0].original_language,
                          "original_title: " + results.results[0].original_title,
                          "overview: " + results.results[0].overview,
                          "popularity: " + results.results[0].popularity,
                          "release_date: " +results.results[0].release_date,
                          "vote_average: " +results.results[0].vote_average
                        ]
                        
                      }
                      else 
                         finalResult=["This film doesn't exist !!!!!!!"];
                      return finalResult;
                    }
                   
    getType(response,input)
    {
     //this.alltype[0]="imdb",[1]=trailer,[2]=photo,[3]=wiki,[4]=map,[5]=game,[6]=direction[7]=product

        let res=response._body;
        let url=res;
        let index=-1;
        let indexPopulation=-1;
        let indexGame=-1;
        let index4=-1;
        let index5=-1;
       // index4=input.search(" to ");//check if the type is direction
        index=res.search("cite class=\"iUh30\">");//to find the url in the html
        indexPopulation=res.search("data-original-name=\"Area\"");//check if the type is city
        indexGame=res.search("platform");//check if the type is game 
        url=url.substring(index+11, index +100);//give the first url from the google search
        console.log("the url of google is : " + url);

        if(url.search("imdb")!=-1 || url.search("youtube")!=-1 )//if the first url is imdb or youtube 
            this.alltype[0]++;
        else if (url.search("steam")!=-1)//if the first url is steam 
            this.alltype[5]++;
        else if(res.search("Release date")!=-1)
             this.alltype[0]++;
        else if(input.search(" to ")!=-1)
            this.alltype[6]++;
        else if(indexPopulation!=-1 || res.search("data-original-name=\"Address\"")!=-1 || res.search("data-original-name=\"Superficie\"")!=-1)
            this.alltype[4]++;  
        else if(indexGame!=-1 )
         this.alltype[5]++;
         else 
         this.alltype[3]++;

            
        return this.alltype;

    }
    getColums(type)
    {
        if(type=="game" || type=="film")
            return ['position', 'name', 'url','url2'];
        else    
            return ['position', 'name', 'url'];
    }
    getFinalType(typeArray)
    {
        let max=0;
        let count=0;
        let type;
        for(let i=0;i<this.alltype.length;i++)
        {
            if(count<typeArray[i])
            {
                max=i;
                count=typeArray[i];
            }
              
        }
        console.log(max);
        if(max==0)
            type="film";
        if(max==2)
            type="photo";
        if(max==3)
            type="wiki";
        if(max==4)
            type="map";
        if(max==5)
            type="game";
        if(max==6)
            type="direction";

            return type;      
    }
    clearTheArrayType()
    {
        for(let i= 0 ; i<7 ; i++)
            this.alltype[i]=0;
    }
    
}   