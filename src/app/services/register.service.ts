import { Injectable } from '@angular/core';
import {UserModel} from '../models/usermodel';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class RegisterService {

  constructor(
    private http: Http) { }


  registerUser(user:UserModel){
    let body = JSON.stringify(user);
    console.log(body);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post('https://localhost:9090/Wpl/user/add/', body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    console.log(res);
    return res.statusText || {};
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw('Email already in use. Please try again.');
  }

}
