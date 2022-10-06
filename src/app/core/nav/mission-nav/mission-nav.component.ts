import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ConversationService } from 'src/app/shared/services/conversation.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { CurrentPageService } from 'src/app/shared/services/current-page.service';
import { environment } from 'src/environments/environment.prod';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-mission-nav',
  templateUrl: './mission-nav.component.html',
  styleUrls: ['./mission-nav.component.scss']
})
export class MissionNavComponent implements OnInit {

  profileId: string;
  profile: any;
  profileImgUrl = environment.profileImgUrl;
  compteur = interval(4000);
  stopCompteur: boolean = false;
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
    this.getNotifications();
    if(this.profileId) this.getProfileInfo();
    
    if (isPlatformBrowser(this.platformId)) {
      this.compteur
    .pipe(
      takeWhile(() => !this.stopCompteur)
    )
    .subscribe((n) => {
      this.getNotifications(); 
    });
    }

    
  
  }

  ngOnDestroy(){
    this.stopCompteur = true;
  }

  getNotifications(){
    this.conversationS.getNotifications().subscribe(
      data => { 
        this.notifications = parseInt(data.data.postulationNbr) + parseInt(data.data.projectNbr);
        this.notificationsPostulation = parseInt(data.data.postulationNbr);
        this.notificationsProjet = parseInt(data.data.projectNbr);
        this.conversationS.notificationsParam.next(data.data);
      }
    )
  }

  setRouter(path){
    this.router.navigateByUrl(path);
  }
  createProject(){
    this.router.navigateByUrl('/projet/creer?redirectTo='+this.router.url);
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


