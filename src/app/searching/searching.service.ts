import { SearchingComponent } from './searching.component';
import { Component } from '@angular/core';
import {Http,Response,HttpModule,} from '@angular/http';
import {HttpClientModule} from '@angular/common/http'; 
import 'rxjs/add/operator/map'

export class APIservice{

   /* data:any={};
    private apiUrl="http://api.duckduckgo.com/?q=";  
    constructor(private http:Http){
        this.getData();
        this.getContact();
    } 
    getAnswer(input){
        this.apiUrl+=input+"&format=json";
    }
    getData(){
        return this.http.get(this.apiUrl).map((res:Response) => res.json());
        
    }
    getContact()
    {
        this.getData().subscribe(data=>{
            console.log(data);
            this.data=data;
        })
    }*/
    
}