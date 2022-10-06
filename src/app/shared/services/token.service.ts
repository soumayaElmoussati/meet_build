import { isPlatformBrowser,isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Buffer } from 'buffer';
import { UniversalStorage } from '../storage/universal.storage';
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private iss = {
    login : environment.apiUrl + 'login',
    checkPaymeznt : environment.apiUrl + 'checkPayment',
  };
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(UniversalStorage) private _appStorage: Storage
  ) { }

  handletoken(token){
    this.set(token);
  }

  set(token){
      this._appStorage.setItem('token', token);
  }
  

  get(){
    let token = '';
    token = this._appStorage.getItem('token');
    return token;
  }

  remove(){
    this._appStorage.removeItem('token');
  }

  isValide(){
    const token = this.get();
    if(token !== null){
      const payload = this.payload(token);
      return true;
      if(payload){
        return Object.values(this.iss).includes(payload.iss);
        //return (Object.values(this.iss).indexOf(payload.iss) > -1) ? true : false;
      }
      return false;
    }
    return false;
  }
  /*

  payload(token){
      const payload = token.split('.')[1];
      return this.decode(payload);
  }*/

  payload(token){
    if(token){
    const payload = token.split('.')[1];
    return this.decode(payload);
    }else{
    return 'No connection';
    }
    }


  decode(payload){
    if (payload) {
      var  value = Buffer.from(payload, 'base64').toString();
      return JSON.parse(value);
    } else {
    return 'No Api';
    }
    }

  loggedIn(){
    return this.isValide();
  }

  getUserId(){
    if(!this.isValide()) return null;
    const token = this.get();
    const payload = this.payload(token);
    return payload.sub;
  }

  getToken(){
    let token = '';
    token = this._appStorage.getItem('token')
    return token ? true :  false ;
  }
  getRole(){
    if(!this.isValide()) return null;
    const token = this.get();
    const payload = this.payload(token);
    return payload.role;
  }
  getSlug(){
    if(!this.isValide()) return null;
    const token = this.get();
    const payload = this.payload(token);
    return payload.slug;
  }
  getId(){
    if(!this.isValide()) return null;
    const token = this.get();
    const payload = this.payload(token);
    return payload.id;
  }
  getEmail(){
    if(!this.isValide()) return null;
    const token = this.get();
    const payload = this.payload(token);
    return payload.email;
  }
  getStatus(){
    if(!this.isValide()) return null;
    const token = this.get();
    const payload = this.payload(token);
    return payload.status;
  }

}
