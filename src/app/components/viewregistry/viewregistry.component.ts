import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {DataserviceService} from '../../services/dataservice.service';
import {Router, ActivatedRoute} from '@angular/router';
import {UserRegistryService} from '../../services/user-registry.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { RegistryModel } from '../../models/registryModel';
import {AuthserviceService} from '../../services/authservice.service'
import {UserModel} from '../../models/usermodel';
import { Ng2SmartTableModule, LocalDataSource  } from 'ng2-smart-table';
import {RegistryItemModel} from '../../models/registryitemmodel';
import {InventoryService} from '../../services/inventory.service';
import {InventoryModel} from '../../models/inventorymodel';
import {UserRegistryModel} from '../../models/userregistrymodel';

@Component({
  selector: 'app-viewregistry',
  templateUrl: './viewregistry.component.html',
  styleUrls: ['./viewregistry.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ViewregistryComponent implements OnInit {
  
  registryItemsSource: LocalDataSource;
  registryItemsdata:UserRegistryModel[] = [];  
  allInventoryItemsSource: LocalDataSource;
  inventoryItemsData:InventoryModel[] = [];
  userEmail:String = '';
  registryUrl:String = '';
  registry:RegistryModel;
  user:UserModel;
  allInventoryItems:InventoryModel[];
  settingsForRegistryItems = {
    delete: {
      confirmDelete: true,
    },
    actions	:{
      edit:false,
      add:false
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
      userEmail: {
        title: 'Gifted By User',
        width: '10px',
        editable: 'false'
      }
    },
    mode: 'external'
  };
  settingsForAllInventoryItems = {
    actions	:{
      edit:false,
      add:false,
      delete:false
    },
    columns: {
      itemName: {
        title: 'Name'
      },
      category: {
        title: 'Category'
      },
      color: {
        title: 'Color'
      },
      price: {
        title: 'Price',
        width: '10px'
      },
      size: {
        title: 'Size',
        width: '10px'
      }
    },
    mode: 'external',
    pager:{
      display:true,
      perPage: 8
    }
  };

  constructor(
    private dataService: DataserviceService,
    private router: Router,
    private userRegistryService: UserRegistryService,
    private route: ActivatedRoute,
    private flashMessagesService: FlashMessagesService,
    private authService: AuthserviceService,
    private inventoryService: InventoryService
  ) {
    this.registryItemsSource = new LocalDataSource(this.registryItemsdata);
    this.allInventoryItemsSource = new LocalDataSource(this.inventoryItemsData);
  }

  ngOnInit() {
    
    this.registryUrl = this.route.snapshot.params['regUrl'];
    this.dataService.currentMessage.subscribe(message=>{
      this.userEmail = message;
      console.log(message);
    });
    this.loadAllItems();
    this.userRegistryService.fetchUserRegistry(this.registryUrl)
    .subscribe(
      result => {
        this.flashMessagesService.show('Single Registry fetch successful!',{
          cssClass:'alert-success',
          timeout:'2000'
        });
        this.registry = result.json();
        this.loadUser();
        this.loadRegistryItems();
        console.log(this.registry.userEmail +"is the user email");
      },
      error => {
        this.flashMessagesService.show('Failed to fetch registries'+error,{
          cssClass:'alert-danger',
          timeout:'2000'
        });
      }
    );
  }

  loadUser(){
    this.authService.fetchUser(this.userEmail)
    .subscribe(
      result => {
        console.log(result);
        this.user = result.json();
      },
      error => {
        console.log(error);
      }
    );
  }

  loadAllItems(){
    this.inventoryService.getAllItems()
      .subscribe(
        result => {
          this.allInventoryItems = result.json();
          console.log("List of Inventory Items: "+JSON.stringify(this.allInventoryItems));
          for(let item of this.allInventoryItems){
            this.allInventoryItemsSource.add(item);
          }
          this.allInventoryItemsSource.refresh();
        }, error => {
          console.log(error);
        }
      );
  }

  loadRegistryItems(){
    this.userRegistryService.fetchRegistryItems(this.registryUrl)
    .subscribe(
      result => {
        let registryItems:RegistryItemModel[] = result.json();
        this.populateTable(registryItems);
        console.log("Registry Items Fetched. \n");
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
            let itemForRegistry:UserRegistryModel = {
              itemId:registryItem.itemId,
              itemName: itemFetched.itemName,
              category: itemFetched.category,
              color: itemFetched.color,
              price: itemFetched.price,
              userEmail: registryItem.userEmail  
            }
            console.log("Item Fetched");
            this.registryItemsSource.add(itemForRegistry);
            this.registryItemsSource.refresh();
          },
          error=>{
            console.log(error);
          }
        );
    }
  }

  onDeleteRegistryItem(event){
    if (window.confirm('Are you sure you want to delete?')) {
      console.log(event);
      this.userRegistryService.deleteRegistryItem(this.registryUrl, event.data.itemId)
        .subscribe(
          result=>{
            this.flashMessagesService.show('Item deleted from your registry.',{
              cssClass:'alert-success',
              timeout:'2000'
            });
            this.registryItemsSource.remove(event.data);
            this.registryItemsSource.refresh();
          },
          error=>{
            console.log(error);
          }
        );
    } else {

    }
    console.log(event.data);
  }
  
  onRowSelect(event){
    console.log(event.data);
    let registryItem:RegistryItemModel = {
      itemId: event.data.itemId,
      quantity: event.data.quantity,
      url: this.registryUrl,
      taken:0,
      userEmail:null
    };
    this.userRegistryService.addItemToRegistry(registryItem, this.registryUrl).subscribe(
      result => {
        console.log(result);
        this.allInventoryItemsSource.remove(event.data);
        this.registryItemsSource.add(event.data);
        this.registryItemsSource.refresh();
      },
      error=>{
        this.flashMessagesService.show('Item already in your registry.',{
          cssClass:'alert-danger',
          timeout:'2000'
        });
      }
    );
  }


}
