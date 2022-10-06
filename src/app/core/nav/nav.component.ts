import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TokenService } from 'src/app/shared/services/token.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  
  role: string = '';

  @Output() menuStatusChanged: EventEmitter<any> = new EventEmitter<boolean>();
  @Output() phoneMenuStatus: EventEmitter<any> = new EventEmitter<boolean>();
 
  

  constructor(
    private authS: AuthService
  ) {}

  ngOnInit(): void {
    this.authS.newUserRole.subscribe( data => {
      if(data?.includes('job')){
        this.role = 'job'
      }else{
        this.role = 'mission'
      }
    } )
  }

  menuStatusChange(opened){
    this.menuStatusChanged.emit(opened);
  }

  onPhoneMenuTogel(opened){
    this.phoneMenuStatus.emit(opened);
  }
 


  
}
