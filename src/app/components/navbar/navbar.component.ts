import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {AuthserviceService} from '../../services/authservice.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import {DataserviceService} from '../../services/dataservice.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {

  isLoggedIn: boolean = false;
  showRegister: boolean;
  loggedInUser: String;
  userEmail: String;
  constructor(
    private authService: AuthserviceService,
    private flashMessagesService: FlashMessagesService,
    private router: Router,
    private dataService: DataserviceService) { }

  ngOnInit() {
    this.dataService.currentMessage.subscribe(message => {
      if(message!=''){
        this.loggedInUser = 'Welcome, '+ message;
        this.userEmail = message;
        this.isLoggedIn = true;
      } else if(message=='') {
        this.loggedInUser = '';
        this.isLoggedIn = false;
        this.router.navigate(['login']);
      }
    });
  }
  
  onLogoutClick(){
    this.dataService.changeMessage('');
  }

}
