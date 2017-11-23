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
}   