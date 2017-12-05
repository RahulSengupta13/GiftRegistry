import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataserviceService } from '../../services/dataservice.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router, ActivatedRoute } from '@angular/router';
import {AuthserviceService} from '../../services/authservice.service';
import {RegistryModel} from '../../models/registryModel';
import {UserRegistryService} from '../../services/user-registry.service';
import {UserModel} from '../../models/usermodel';
import {SharedRegistryModel} from '../../models/sharedregistrymodel';

@Component({
  selector: 'app-createregistry',
  templateUrl: './createregistry.component.html',
  styleUrls: ['./createregistry.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class CreateregistryComponent implements OnInit {

  date:number;
  year:string;
  day:string;
  month:string;

  minDate={
    year: 0,
    month: 0,
    day: 0
  };

  users:UserModel[] = [];
  sharedUsers:SharedRegistryModel[] = [];

  user = {
    firstName: '',
    lastName: '',
    registryId: 0,
    registryName: '',
    eventDate: {
      year:'',
      month:'',
      day:''
    },
    url: 'ras.pi-',
    userEmail:'',
    share: false
  };

  registry: RegistryModel = {
    registryId: 0,
    registryName: '',
    eventDate: '',
    share:0,
    userEmail:'',
    url:''
  };

  userEmail:String='';

  constructor(
    private dataService: DataserviceService,
    private flashMessageService: FlashMessagesService,
    private router: Router,
    private route: ActivatedRoute,
    private authService:AuthserviceService,
    private userRegistryService: UserRegistryService
  ) { }
  
  ngOnInit() {
    this.user.registryName = this.route.snapshot.params['regName'];
    this.dataService.currentMessage.subscribe(message => {
      this.userEmail = message;
      this.user.userEmail = message.toString();
      this.authService.fetchUser(this.userEmail).subscribe(
        result => {
          // this.user = result._body;
          console.log(result);
          let jsonData = JSON.parse(result._body);  
          this.user.firstName = jsonData.firstName;
          this.user.lastName = jsonData.lastName;
        },
        error => {
          console.log(error);
        }
      );
    });

    let datePipe = new DatePipe('en-US');
    this.date = Date.now();
    this.minDate = {
      year: parseInt( datePipe.transform(this.date,'yyyy')),
      month: parseInt(datePipe.transform(this.date,'MM')),
      day: parseInt(datePipe.transform(this.date,'dd'))
    };
    this.loadAllUsers();
  }

  loadAllUsers(){
    this.userRegistryService.fetchAllUsersForSharing(this.userEmail).subscribe(
      result => {
        console.log(result);
        this.users = result.json();
      },
      error => {
        console.log(error);
      }
    );
  }

  onChangeSharedUser(user:UserModel){
    // console.log(JSON.stringify(user));
    let sharedUser:SharedRegistryModel = {
      url:this.user.url,
      SharedUsers: user.email,
      emailId: this.userEmail
    }
    this.sharedUsers.push(sharedUser);
  }

  onSubmit({value,valid}:{value: any, valid: boolean}){
    if(valid){  
      this.registry.registryName = this.user.registryName;
      this.registry.eventDate = this.user.eventDate.year+"-"+this.user.eventDate.month+"-"+this.user.eventDate.day;
      if(this.user.share)
        this.registry.share = 1;
      else
        this.registry.share = 0;
      this.registry.url = this.user.url;
      this.registry.userEmail = this.user.userEmail;
      for(let user of this.sharedUsers){
        user.url = this.registry.url
      }
      // console.log(this.registry);
      console.log(JSON.stringify(this.sharedUsers));
      this.userRegistryService.createUserRegistry(this.registry).subscribe(
        result => {
          console.log(result);
          this.flashMessageService.show('Registry creation successful!',{
            cssClass:'alert-success',
            timeout:'4000'
          });
          if(this.registry.share){
            for(let user of this.sharedUsers){
              console.log(JSON.stringify(user));
              this.addToSharedRegistries(user);
            }
          } else {
            let userShared:SharedRegistryModel = {
              emailId: this.userEmail,
              url:this.registry.url,
              SharedUsers:"*"
            }
            this.addToSharedRegistries(userShared);
          }
          this.flashMessageService.show('Registry successfuly created.',{cssClass: 'alert-success',timeout:3000});
          this.router.navigate(['']);
        },
        error=>{
          console.log(error);
          this.flashMessageService.show('Registry creation failed.',{
            cssClass:'alert-danger',
            timeout:'4000'
          });
        }
      );
    } else{
      this.flashMessageService.show('Please fill all the fields and try again.',{cssClass: 'alert-danger',timeout:3000});
      this.router.navigate(['/create-registry/'+' ']);
    }
  }

  addToSharedRegistries(user:SharedRegistryModel){
    this.userRegistryService.addToSharedRegistries(user)
    .subscribe(
      result=>{
        console.log(result.json());
      }, error => {
        console.log(error);
      }
    );
  }


}
