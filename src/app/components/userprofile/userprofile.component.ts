import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthserviceService } from '../../services/authservice.service';
import { UserModel } from '../../models/usermodel';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserprofileComponent implements OnInit {

  constructor(
    private flashMessageService: FlashMessagesService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthserviceService) { }

  userEmail:String = '';
  user:UserModel;
  ngOnInit() {
    this.userEmail = this.route.snapshot.params['userEmail'];
    this.fetchUser();
    console.log(JSON.stringify(this.user));
  }

  fetchUser(){
    this.authService.fetchUser(this.userEmail).subscribe(
      result => {
        this.user = result.json();
        console.log(JSON.stringify(this.user));
      },
      error => {
        console.log(error);
      }
    );
  }

  onSubmit({value, valid}:{value: UserModel, valid:boolean}){
    console.log(value);
    if(!valid){
      this.flashMessageService.show('Please fill in all fields.',{
        cssClass:'alert-danger',
        timeout:'3000'
      });
      this.router.navigate(['/view/'+this.userEmail]);
    } else{
      this.authService.updateUser(this.userEmail,value).subscribe(
        result => {
          console.log(result);
          this.flashMessageService.show('User profile successfully updated.',{
            cssClass:'alert-success',
            timeout:'4000'
          });
          this.router.navigate(['']);
        },
        error=>{
          this.flashMessageService.show('Updation failed. Please try again.',{
            cssClass:'alert-danger',
            timeout:'4000'
          });
          this.router.navigate(['']);
        }
      );

    }
  }

}
