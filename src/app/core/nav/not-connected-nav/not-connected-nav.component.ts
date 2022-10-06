import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-connected-nav',
  templateUrl: './not-connected-nav.component.html',
  styleUrls: ['./not-connected-nav.component.scss']
})
export class NotConnectedNavComponent implements OnInit {

  openMenu = false;

  @Output() menuStatusChange: EventEmitter<any> = new EventEmitter<boolean>();
 
  
  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
  }

  setRouter(path){
    this.router.navigateByUrl(path);
  }
  createProject(){
    this.router.navigateByUrl('/projet/creer?redirectTo='+this.router.url);
  }
  createAd(){
    this.router.navigateByUrl('/job/creer?redirectTo='+this.router.url);
  }


  onOpenMenu(){
    this.menuStatusChange.emit(!this.openMenu); 
  }

}
