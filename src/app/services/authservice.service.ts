import { Injectable } from '@angular/core';
import { UserModel } from '../models/usermodel';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class AuthserviceService {

  loggedInUser: UserModel;
  loggedInUserEmail:String;

  constructor(public http:Http) {
  }
  
  authenticateUser(userEmail:string,userPassword:string): Observable<any>{
    let options = new RequestOptions({ 
      params:{
      'email': userEmail,
      'password': userPassword
      }
    });
    return this.http.get('https://localhost:9090/Wpl/user/authenticateuser/',options)
      .map(res => {
        console.log(res);
        if(res){
          console.log('User logged in!');
          localStorage.setItem('currentUser', userEmail);
        }
        return res;
      })
      .catch(this.handleError);
  }

  logoutUser(){
    localStorage.removeItem('currentUser');
  }

  authenticateAdmin(userEmail:string,userPassword:string): Observable<any>{
    
        let options = new RequestOptions({ 
          params:{
          'email': userEmail,
          'password': userPassword
          }
        });
        return this.http.get('https://localhost:9090/Wpl/user/authenticateadmin/',options)
          .map(res => {
            return res;
          })
          .catch(this.handleError);
      }

  fetchUser(email:String): Observable<any>{
    let options = new RequestOptions({ 
      params:{
      'email': email
      }
    });
    return this.http.get('https://localhost:9090/Wpl/user/getuser/',options)
      .map(res => {
        console.log(res);
        return res;
      })
      .catch(this.handleError);
  }

  updateUser(email:String, user:UserModel){
    let body = JSON.stringify(user);
    console.log(body);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ 
      headers: headers,
      params:{
        'email':email
      }
    });
    return this.http.put('https://localhost:9090/Wpl/user/updateuser/',body, options)
      .map(res => {
        console.log(res);
        return res;
      })
      .catch(this.handleError);
  }
  private handleError(error: Response) {
    console.error(error);
    return Observable.throw('Invalid Credentials. Please try again.');
  }

}
