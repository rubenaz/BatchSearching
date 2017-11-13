import { SearchingComponent } from './searching.component';
import { Component } from '@angular/core';
import {Http,Response,HttpModule,} from '@angular/http';
import {HttpClientModule} from '@angular/common/http'; 
import 'rxjs/add/operator/map'
import { Injectable } from '@angular/core';

@Injectable()
export class APIservice{

    results:any[];
    private apiUrl;

    constructor(){}

    load(result:any[]){

      }
    }