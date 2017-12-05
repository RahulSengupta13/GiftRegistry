import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-not-a-page',
  templateUrl: './not-a-page.component.html',
  styleUrls: ['./not-a-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NotAPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
