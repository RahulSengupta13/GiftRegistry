import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {InventoryService} from '../../services/inventory.service';
import {InventoryModel} from '../../models/inventorymodel';
import { Ng2SmartTableModule, LocalDataSource  } from 'ng2-smart-table';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {

  allInventoryItemsSource: LocalDataSource;
  inventoryItemsData:InventoryModel[] = [];
  allInventoryItems:InventoryModel[];
  addMenuVisiblity:boolean = true;
  addItemModel:InventoryModel = {
    category:'',
    itemName:'',
    color:'',
    price:0,
    quantity:0,
    size:0
  };
  settingsForAllInventoryItems = {
    actions	:{
      edit:false,
      add:false,
      delete:true
    },
    add:{
      inputClass: "input class"
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
    mode: 'external'
  };


  constructor(
    private flashMessagesService: FlashMessagesService,
    private inventoryService: InventoryService
  ) {
    this.allInventoryItemsSource = new LocalDataSource(this.inventoryItemsData);
   }

  ngOnInit() {
    this.loadAllItems();
  }

  loadAllItems(){
    this.inventoryService.getAllItems()
      .subscribe(
        result => {
          this.allInventoryItems = result.json();
          for(let item of this.allInventoryItems){
            this.allInventoryItemsSource.add(item);
          }
          this.allInventoryItemsSource.refresh();
        }, error => {
          console.log(error);
        }
      );
  }

  onCreate(event){
    console.log(event);
  }

  onDelete(event){
    this.inventoryService.deleteItemFromInventory(event.data.itemId)
    .subscribe(
      result=>{
        this.flashMessagesService.show('Item deleted from the inventory.',{
          cssClass:'alert-success',
          timeout:'2000'
        });
        this.allInventoryItemsSource.remove(event.data);
        this.allInventoryItemsSource.refresh();
      },
      error=>{
        console.log(error);
      }
    );
  }

  onSubmit({value,valid}:{value: any,valid: boolean}){
    if(value){
      console.log(value);
      console.log(JSON.stringify(this.addItemModel));
      this.inventoryService.addItemToInventory(this.addItemModel).subscribe(
        result => {
          this.allInventoryItemsSource.add(this.addItemModel);
          this.allInventoryItemsSource.refresh();
          console.log(result);
          this.flashMessagesService.show('Item addition successful.',{
            cssClass:'alert-success',
            timeout:'2000'
          });
        },
        error=>{
          this.flashMessagesService.show('Item addition failed.'+error,{
            cssClass:'alert-danger',
            timeout:'2000'
          });
        }
      );
    } else {
      this.flashMessagesService.show('Item not added. Please try again.',{
        cssClass:'alert-danger',
        timeout:'2000'
      });
    }
  }

}
