import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DataserviceService } from '../../services/dataservice.service';
import {UserRegistryService} from '../../services/user-registry.service';
import { RegistryModel } from '../../models/registryModel';
import { UserModel } from '../../models/usermodel';
import { AuthserviceService } from '../../services/authservice.service';
import { Ng2SmartTableModule, LocalDataSource  } from 'ng2-smart-table';
import {InventoryService} from '../../services/inventory.service';
import {InventoryModel} from '../../models/inventorymodel';
import {RegistryItemModel} from '../../models/registryitemmodel';
import {UserGiftedOrNotModel} from '../../models/usergiftedornotmodel';

@Component({
  selector: 'app-viewsharedregistries',
  templateUrl: './viewsharedregistries.component.html',
  styleUrls: ['./viewsharedregistries.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewsharedregistriesComponent implements OnInit {

  constructor(
    private flashMessageService: FlashMessagesService,
    private router: Router,
    private route: ActivatedRoute,
    private userRegistryService: UserRegistryService,
    private dataService: DataserviceService,
    private authService: AuthserviceService,
    private inventoryService: InventoryService
  ) { 
    this.registryItemsSource = new LocalDataSource(this.registryItemsdata);
  }

  registryUrl:String = '';
  userEmail:String = '';
  registry:RegistryModel;
  user:UserModel;
  // registryItemsdata:InventoryModel[] = [];  
  // registryItemsSource: LocalDataSource;

  registryItemsdata:UserGiftedOrNotModel[] = [];  
  registryItemsSource: LocalDataSource;
  registryItems:RegistryItemModel[];
  settingsForRegistryItems = {
    actions	:{
      edit:false,
      add:false,
      delete:false
    },
    columns: {
      itemName: {
        title: 'Name',
        editable: 'false'
      },
      category: {
        title: 'Category',
        editable: 'false'
      },
      color: {
        title: 'Color',
        editable: 'false'
      },
      price: {
        title: 'Price',
        width: '10px',
        editable: 'false'
      },
      quantity: {
        title: 'Quantity',
        width: '10px',
        editable: 'false'
      },
      gifted: {
        title: 'Gifted Status',
        editable: 'false'
      }
    },
    mode: 'external'
  };

  ngOnInit() {
    this.dataService.currentMessage.subscribe(
      message=>{
        this.userEmail = message;
      }
    );
    this.registryUrl = this.route.snapshot.params['regUrl'];
    this.fetchUserRegistry();
  }

  loadRegistryItems(){
    this.userRegistryService.fetchRegistryItems(this.registryUrl)
    .subscribe(
      result => {
        this.registryItems = result.json();
        this.populateTable(this.registryItems);
        console.log(JSON.stringify(this.registryItems));
      },
      error => {
        console.log("Unable to fetch registry items fetched. \n"+error);
      }
    );
  }

  populateTable(registryItems:RegistryItemModel[]){
    for(let registryItem of registryItems){
      this.inventoryService.getItemDetails(registryItem.itemId)
        .subscribe(
          result=>{
            let itemFetched:InventoryModel = result.json();
            let giftedStatus:String;
            if(registryItem.taken==0){
              giftedStatus = 'Available to gift.'
            } else {
              giftedStatus = 'Already gifted.'
            }
            let userRegistryModel:UserGiftedOrNotModel ={
              itemId:registryItem.itemId,
              itemName:itemFetched.itemName,
              category:itemFetched.category,
              color:itemFetched.color,
              price:itemFetched.price,
              quantity:itemFetched.quantity,
              gifted: giftedStatus
            }
            console.log("Item Fetched");
            this.registryItemsSource.add(userRegistryModel);
            this.registryItemsSource.refresh();
          },
          error=>{
            console.log(error);
          }
        );
    }
  }

  fetchUser(){
    this.authService.fetchUser(this.registry.userEmail).subscribe(
      result => {
        this.user = result.json();
        console.log(JSON.stringify(this.user));
      },
      error => {
        console.log(error);
      }
    );
  }

  fetchUserRegistry(){
    this.userRegistryService.fetchUserRegistry(this.registryUrl)
    .subscribe(
      result => {
        this.flashMessageService.show('Single Registry fetch successful!',{
          cssClass:'alert-success',
          timeout:'2000'
        });
        this.registry = result.json();
        this.fetchUser();
        this.loadRegistryItems();
        console.log(JSON.stringify(this.registry));
      },
      error => {
        this.flashMessageService.show('Failed to fetch registries'+error,{
          cssClass:'alert-danger',
          timeout:'2000'
        });
      }
    );
  }

  onRowSelect(event){
    console.log(event);
    let itemId = event.data.itemId;
    let Booked:boolean = true;
    for(let item of this.registryItems){
      if(item.itemId == itemId && item.taken!=1){
        console.log("Item not Booked"+item.itemId+event.data.taken);
        Booked = false;
      }
    }
    if(!Booked){
      this.userRegistryService.selfAssign(this.registryUrl,itemId,this.userEmail)
      .subscribe(
        result => {
          this.flashMessageService.show('Successfully booked item for user!',{
            cssClass:'alert-success',
            timeout:'2000'
          });
          this.registryItemsSource.remove(event.data);
          this.registryItemsSource.refresh();
        },
        error => {
          this.flashMessageService.show('Error booking item. Please try again.',{
            cssClass:'alert-danger',
            timeout:'2000'
          });
        }
      );
    } else {
      this.flashMessageService.show('Item already booked. Please try again.',{
        cssClass:'alert-danger',
        timeout:'2000'
      });
    }
  }
}
