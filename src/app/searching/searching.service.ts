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
        if(input.lastIndexOf("\n")==(input.length-1))
            return true;
        return false;
         
    }

    load(input){    
        console.log(input);
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
        console.log(temp);
        return temp;
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
        else if (type=="photo")
        {
            this.apiUrl="http://api.duckduckgo.com/?q="; 
            this.apiUrl+=search +"&format=json&pretty=1";

           // this.apiUrl="https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=33870ee66d8bf44b0cc3c8c95cace552&text=" + search +"&format=json&nojsoncallback=1&per_page=1"
        }
        else if(type=="wiki")
        {
            this.apiUrl="https://en.wikipedia.org/w/api.php?action=opensearch&search=" + search +"&limit=10&format=json&origin=*" ;
        }
        else if (type=="map")
        {
            this.apiUrl="https://www.google.com/maps/embed/v1/place?q=" + search + "&key=AIzaSyDntIUhIrk3e1FjrOEy_EwO7bFrSCt3Eos";
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