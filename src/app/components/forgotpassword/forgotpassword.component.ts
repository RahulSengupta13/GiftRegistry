import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserModel } from '../../models/usermodel';
import { AuthserviceService } from '../../services/authservice.service';
import { EmailValidator } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotpasswordComponent implements OnInit {

  email:String = '';
  securityQuestion:String = '';
  securityAnswer:String;
  actualSecurityAnswer:String;
  disableAnswer:boolean = true;
  password:String = '';
  userPassword:String = '';

  constructor(
    private flashMessageService: FlashMessagesService,
    private authService:AuthserviceService
  ) { 
    this.securityAnswer = '';
    this.actualSecurityAnswer='';
  }

  ngOnInit() {

  }

  onSubmit({value, valid}:{value:any,valid:boolean}){
    if(valid){
      if(value.securityAnswer == this.actualSecurityAnswer){
        this.flashMessageService.show('Success.',{
          cssClass:'alert-success',
          timeout:'3000'
        });
        this.password = this.userPassword;
      }
    } else {
      console.log(valid);
    }
  }

  checkUser(){
    this.authService.fetchUser(this.email).subscribe(
      result => {
        let user:UserModel = result.json();
        this.securityQuestion = user.securityQuestion;
        this.actualSecurityAnswer = user.securityAnswer;
        this.disableAnswer = false;
        this.userPassword = user.password;
        this.flashMessageService.show('Email found in database. Please answer the question.',{
          cssClass:'alert-success',
          timeout:'3000'
        });
      },
      error => {
        console.log(error);
        this.flashMessageService.show('Email not found in database. Please try again.',{
          cssClass:'alert-danger',
          timeout:'3000'
        });
      }
    );
  }

}
