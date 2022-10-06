import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, interval } from 'rxjs';
import { AdminService } from 'src/app/shared/services/admin.service';
import { CurrentPageService } from 'src/app/shared/services/current-page.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { SendInvitationComponent } from './send-invitation/send-invitation.component';

@Component({
  selector: 'app-my-rates',
  templateUrl: './my-rates.component.html',
  styleUrls: ['./my-rates.component.scss']
})
export class MyRatesComponent implements OnInit {

  profileSlug: string;
  profileId: string;
  evaluations: any;
  currentPage = 1;
  perPage = 5;
  profile: any;
  noEvaluations: boolean;
  
  
  constructor(
    private profileS: ProfileService,
    private dialog: MatDialog,
    private router: Router,
    private tokenS: TokenService,
    private currentPageS: CurrentPageService,
  ) {
    this.profileId = this.tokenS.getId();
    this.profileSlug = this.tokenS.getSlug();
  }

  ngOnInit(): void {
    this.currentPageS.meCurrentLink.next('evaluations');
    this.getMyEvaluations();
    this.getProfileInfo();
  }

  getMyEvaluations(){
    this.profileS.getEvaluations(this.perPage ,  this.currentPage).subscribe(
      data => { this.evaluations = data},
      error => {},
      () => { 
        if(this.evaluations.data.length == 0) this.noEvaluations = true;
      }
    )
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

  navigateTo(page){
    this.currentPage = page;
    this.getMyEvaluations();
  }

  onSendInvitation(){
    const dialog = this.dialog.open( SendInvitationComponent , {
      width: '600px',
      height: 'auto',
      disableClose: true
    });

    dialog.afterClosed().subscribe(result => {
      if(result && result.confirm){
        
      }
    })
  }

  setRouter(path){
    this.router.navigateByUrl(path);
  }

}
