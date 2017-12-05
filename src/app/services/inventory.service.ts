import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { InventoryModel } from '../models/inventorymodel';

@Injectable()
export class InventoryService {

  constructor(
    public http:Http
  ) { }

  getItemDetails(itemId:number){
    let options = new RequestOptions({ 
      params:{
      'itemId': itemId
      }
    });
    return this.http.get('https://localhost:9090/Wpl/inventory/getitem/', options)
      .map(res => {
        return res;
      })
      .catch(this.handleError);
  }

  getAllItems(){
    let options = new RequestOptions({ 
    });
    return this.http.get('https://localhost:9090/Wpl/inventory/inventoryitemlist/', options)
      .map(res => {
        return res;
      })
      .catch(this.handleError);
  }
  
  deleteItemFromInventory(itemId:number){
    let options = new RequestOptions({ 
      params:{
      'itemId': itemId
      }
    });
    return this.http.delete('https://localhost:9090/Wpl/inventory/removeitem/', options)
      .map(res => {
        return res;
      })
      .catch(this.handleError);
  }

  addItemToInventory(item:InventoryModel){
    let body = JSON.stringify(item);
    console.log(body);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post('https://localhost:9090/Wpl/inventory/add/', body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  
  private extractData(res: Response) {
    console.log(res);
    return res.statusText || {};
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw('Unable to delete item with the itemId.');
  }

}
