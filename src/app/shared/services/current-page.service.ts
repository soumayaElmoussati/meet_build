import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentPageService {


  meCurrentLink = new BehaviorSubject(null);
  newMeCurrentLink= this.meCurrentLink.asObservable();

  currentLink = new BehaviorSubject(null);
  newCurrentLink= this.currentLink.asObservable();

  postulationCurrentLink = new BehaviorSubject(null);
  newPostulationCurrentLink= this.postulationCurrentLink.asObservable();
  
  constructor() { }

  
}
