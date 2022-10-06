import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ConversationService } from 'src/app/shared/services/conversation.service';
import { CurrentPageService } from 'src/app/shared/services/current-page.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-job-nav',
  templateUrl: './job-nav.component.html',
  styleUrls: ['./job-nav.component.scss']
})
export class JobNavComponent implements OnInit {

  profileId: string;
  profile: any;
  profileImgUrl = environment.profileImgUrl;
  notifications: number = 0;
  notificationsPostulation: number = 0;
  notificationsProjet: number = 0;
  openMenu = false;
  phoneMenu = false;
  activeLink = "projets";

  @Output() phoneMenuStatus: EventEmitter<any> = new EventEmitter<boolean>();
  @Output() menuStatusChange: EventEmitter<any> = new EventEmitter<boolean>();
 
  
  constructor(
    private router: Router,
    private profileS: ProfileService,
    private tokenS: TokenService,
    private conversationS: ConversationService,
    private currentPageS: CurrentPageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.profileId = this.tokenS.getId();
  }

  ngOnInit(): void {
    this.currentPageS.newCurrentLink.subscribe(
      data => { this.activeLink = data }
    ) 
    if(this.profileId) this.getProfileInfo();
  }
 
  setRouter(path){
    this.router.navigateByUrl(path);
  } 
  createJob(){
    this.router.navigateByUrl('/job/creer?redirectTo='+this.router.url);
  }
  createAd(){
    this.router.navigateByUrl('/job/creer?redirectTo='+this.router.url);
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

  onPhoneMenuTogel(){
    this.phoneMenuStatus.emit(!this.phoneMenu);
    this.phoneMenu = !this.phoneMenu;
  }

  
  
  

}


