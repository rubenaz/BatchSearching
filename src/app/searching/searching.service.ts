import { SearchingComponent } from './searching.component';
import { Component } from '@angular/core';
import {Http,Response,HttpModule,} from '@angular/http';
import {HttpClientModule} from '@angular/common/http'; 
import 'rxjs/add/operator/map'
import { Injectable } from '@angular/core';

@Injectable()
export class APIservice{

    allSearch:string[];
    alltype:string[]=[];
    
    private apiUrl;

    constructor(){}

    error(input){
        if(input.lastIndexOf(",")==(input.length-1))
            return true;
        return false;
         
    }

    load(input){    
        this.allSearch=input.split(",",input.length);
        return this.allSearch;
      }
    returnType(type)
    {
        
        for (var i = 0; i < this.allSearch.length; i++) {
            if(type=="trailer")
            {
                this.alltype[i]="!youtube "
            }
        }  
        return this.alltype;     
    }
    returnURL(type,search)
    {

        if(type=="trailer")
        {
        this.apiUrl="https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + search +" "+ type+"&key=AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos";
        
        }
        else if (type=="photo" || type=="review")
        {
            this.apiUrl="http://api.duckduckgo.com/?q="; 
            this.apiUrl+=search +"&format=json";

           // this.apiUrl="https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=33870ee66d8bf44b0cc3c8c95cace552&text=" + search +"&format=json&nojsoncallback=1&per_page=1"
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
}   