import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ConversationService } from 'src/app/shared/services/conversation.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-cv-nav',
  templateUrl: './cv-nav.component.html',
  styleUrls: ['./cv-nav.component.scss']
})
export class CvNavComponent implements OnInit {
  profileId: string;
  profile: any;
  profileImgUrl = environment.profileImgUrl;
  notifications: number = 0;
  notificationsPostulation: number = 0;
  notificationsProjet: number = 0;
  openMenu = false;

  @Output() menuStatusChange: EventEmitter<any> = new EventEmitter<boolean>();
 
  
  constructor(
    private router: Router,
    private profileS: ProfileService,
    private tokenS: TokenService,
  ) {
    this.profileId= this.tokenS.getId();
  }

  ngOnInit(): void {
    if(this.profileId) this.getProfileInfo();
  }

  setRouter(path){
    this.router.navigateByUrl(path);
  }

  getProfileInfo(){
    this.profileS.about(this.profileId).subscribe(
      data => {
        this.profile = data.data;
      },
      error =>{},
      () => {
        
      }
    )
  }

  onOpenMenu(){
    this.menuStatusChange.emit(!this.openMenu); 
  }
  
  logout(){
    this.tokenS.remove();
    this.router.navigateByUrl('/login');
  } 

 

}
