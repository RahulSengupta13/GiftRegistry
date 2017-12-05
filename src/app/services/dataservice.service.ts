import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class DataserviceService {

  private messageSource = new BehaviorSubject<String>('');
  currentMessage = this.messageSource.asObservable();

  constructor() { }
  
  changeMessage(email: String){
    this.messageSource.next(email);
  }

}
