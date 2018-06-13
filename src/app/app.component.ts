import { SearchingComponent } from './searching/searching.component';
import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  title='app'
  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);
  }
 constructor(private elementRef: ElementRef){

  }
  ngAfterViewInit(){
   this.elementRef.nativeElement.ownerDocument.body.style.height='100%'
    this.elementRef.nativeElement.ownerDocument.body.style.width='100%'
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = ' #444';

 }
}


