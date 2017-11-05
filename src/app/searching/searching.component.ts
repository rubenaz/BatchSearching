import { APIservice } from './searching.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.css'],
  template: `
  <h1>Your Search</h1>
  <input #box/>
  <button (click)="onSave(box.value)">Search</button>
  <h2>{{answer}}</h2>`
})
export class SearchingComponent implements OnInit {
  input;
  answer;
    onSave(message){
      this.input=message;
    }    

  constructor(service:APIservice) {
      this.answer=service.getAnswer(this.input);
   }

  ngOnInit() {
  }

}
