import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {RegistryModel} from '../models/registryModel';
import { RegistryItemModel } from '../models/registryitemmodel';
import {SharedRegistryModel} from '../models/sharedregistrymodel';

@Injectable()
export class UserRegistryService {

  constructor(
    public http:Http
  ) { }

  fetchAllUserRegistries(userEmail:String){
    let options = new RequestOptions({ 
      params:{
      'userEmail': userEmail
      }
    });
    return this.http.get('https://localhost:9090/Wpl/registry/getallregistry/', options)
      .map(res => {
        return res;
      })
      .catch(this.handleError);
  }

  createUserRegistry(registry:RegistryModel){
    let body = JSON.stringify(registry);
    console.log(body);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post('https://localhost:9090/Wpl/registry/add/', body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  fetchUserRegistry(registryUrl:String){
    let options = new RequestOptions({ 
      params:{
      'url': registryUrl
      }
    });
    return this.http.get('https://localhost:9090/Wpl/registry/getregistry/', options)
      .map(res => {
        return res;
      })
      .catch(this.handleError);
  }

  fetchRegistryItems(registryUrl:String){
    let options = new RequestOptions({ 
      params:{
      'registryUrl': registryUrl
      }
    });
    return this.http.get('https://localhost:9090/Wpl/item/itemlist/', options)
      .map(res => {
        return res;
      })
      .catch(this.handleError);
  }

  addItemToRegistry(registryItem:RegistryItemModel, registryUrl:String){
    let body = JSON.stringify(registryItem);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ 
      headers: headers,
      params:{
        'registryUrl': registryUrl
      }
    });
    return this.http.post('https://localhost:9090/Wpl/item/add/', body, options)
      .map(res => {
        return res;
      })
      .catch(this.handleError);
  }

  deleteRegistryItem(registryUrl:String,itemId:number){
    let options = new RequestOptions({ 
      params:{
      'registryUrl': registryUrl,
      'itemId': itemId
      }
    });
    return this.http.delete('https://localhost:9090/Wpl/item/removeitem/', options)
      .map(res => {
        return res;
      })
      .catch(this.handleError);
  }

  fetchAllSharedRegistries(userEmail:String){
    let options = new RequestOptions({ 
      params:{
      'email': userEmail
      }
    });
    return this.http.get('https://localhost:9090/Wpl/userregistry/registrylist/', options)
      .map(res => {
        return res;
      })
      .catch(this.handleError);
  }

  fetchAllUsersForSharing(userEmail:String){
    let options = new RequestOptions({
      params:{
        'email': userEmail
        }
    });
    return this.http.get('https://localhost:9090/Wpl/user/user/', options)
      .map(res => {
        return res;
      })
      .catch(this.handleError);
  }

  addToSharedRegistries(sharedRegistryUser:SharedRegistryModel){
    let body = JSON.stringify(sharedRegistryUser);
    console.log(body);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ 
      headers: headers,
      params:{
        'sharedUser': sharedRegistryUser.SharedUsers
      }
    });
    return this.http.post('https://localhost:9090/Wpl/userregistry/add/', body, options)
      .map(res => {
        return res;
      })
      .catch(this.handleError);
  }

  selfAssign(registryUrl:String, itemId:number, userEmail:String){
    let body = JSON.stringify({});
    console.log(body);
    let options = new RequestOptions({
      params:{

        'registryUrl': registryUrl,
        'itemId': itemId,
        'userEmail': userEmail
      }
    });
    return this.http.put('https://localhost:9090/Wpl/item/selfassignonreg/',body, options)
      .map(res => {
        console.log(res);
        return res;
      })
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    console.log(res);
    return res.statusText || {};
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw('Invalid Credentials. Please try again.');
  }
  
}
