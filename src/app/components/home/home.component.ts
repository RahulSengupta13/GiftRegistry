import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DataserviceService } from '../../services/dataservice.service';
import { Router } from '@angular/router';
import { RegistryModel } from '../../models/registryModel';
import { UserRegistryService } from '../../services/user-registry.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import {SharedRegistryModel} from '../../models/sharedregistrymodel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit {

  userEmail: String = '';
  userRegistries:RegistryModel[];
  sharedRegistries:SharedRegistryModel[] = [];

  constructor(
    private dataService: DataserviceService,
    private router: Router,
    private userRegistryService: UserRegistryService,
    private flashMessagesService: FlashMessagesService
  ){ 
      this.userEmail = localStorage.getItem('currentUser');
  }

  @Output() registryCreated = new EventEmitter<string>();

  ngOnInit() {
    this.dataService.currentMessage.subscribe(message => {
      // this.userEmail = message;
      this.fetchAllUserRegistries();
      this.fetchAllSharedRegistries();
    });
  }

  fetchAllUserRegistries(){
    this.userRegistryService.fetchAllUserRegistries(this.userEmail)
    .subscribe(
      result => {
        this.flashMessagesService.show('Registry fetch successful!',{
          cssClass:'alert-success',
          timeout:'2000'
        });
        this.userRegistries = result.json();
        console.log(this.userRegistries[0]);
      },
      error => {
        console.log(error);
      }
    );
  }

  fetchAllSharedRegistries(){
    this.userRegistryService.fetchAllSharedRegistries(this.userEmail)
    .subscribe(
      result => {
        this.sharedRegistries = result.json();
        console.log(result,this.sharedRegistries);
      },
      error => {
        console.log(error);
      }
    );
  }

  onCreateRegistryClick({value, valid}:{value: any, valid:boolean}){
    if(valid){
      this.router.navigate(['/create-registry/'+value.email]);
    }
  }

}
