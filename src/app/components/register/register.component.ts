import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthserviceService } from '../../services/authservice.service';
import { UserModel } from '../../models/usermodel';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import {RegisterService} from '../../services/register.service';
import { GoogleLoginProvider } from "angular4-social-login";
import { SocialUser } from "angular4-social-login";
import { AuthService } from "angular4-social-login";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class RegisterComponent implements OnInit {
 
  user:UserModel = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',   
    securityAnswer:'',
    securityQuestion:''
  };
  private socialUser:SocialUser;

  createdUser:any;
  constructor(
    private authService: AuthserviceService,
    private flashMessagesService: FlashMessagesService,
    private router: Router,
    private socialAuthService: AuthService,
    private registerService:RegisterService
  ) {


   }

  ngOnInit() {
    this.socialAuthService.authState.subscribe(user => {
      this.socialUser = user;
      this.user.firstName = user.name.split(" ")[0];
      this.user.lastName = user.name.split(" ")[1];
      this.user.email = user.email;
    },
    error=>{
    });
  }

  onSubmit({value, valid}:{value: UserModel, valid:boolean}){
    console.log(value);
    if(!valid){
      this.flashMessagesService.show('Please fill in all fields.',{
        cssClass:'alert-danger',
        timeout:'4000'
      });
      this.router.navigate(['register']);
    } else{
      this.registerService.registerUser(value).subscribe(
        result => {
          console.log(result);
          this.flashMessagesService.show('Registration successful! Please login now.',{
            cssClass:'alert-success',
            timeout:'4000'
          });
          this.socialAuthService.signOut();
          this.router.navigate(['login']);
        },
        error=>{
          this.flashMessagesService.show('Registration failed due to: '+error,{
            cssClass:'alert-danger',
            timeout:'4000'
          });
          this.router.navigate(['register']);
        }
      );
    }
  }

}
