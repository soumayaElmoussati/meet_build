import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotConnectedComponent } from 'src/app/shared/dialogs/not-connected/not-connected.component';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { TokenService } from 'src/app/shared/services/token.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent implements OnInit {

  @Input() profile;
  activeLink = '';

  constructor(
    private profileS: ProfileService,
    private tokenS: TokenService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  followProfile(){
    if( this.tokenS.loggedIn() && this.tokenS.getRole()?.includes('mission') ){
      this.profileS.follow(this.profile.id).subscribe(
        data => {
          this.profile.follow = data.follow;
        },
        error => {},
        () => {}
      )
    }else{
      this.showAuthentificationMessage();
    }
  }

  likeProfile(){
    if( this.tokenS.loggedIn() && this.tokenS.getRole()?.includes('mission') ){
      this.profileS.like(this.profile.id).subscribe(
        data => {
          this.profile.like = data.like;
        },
        error => {},
        () => {}
      )
    }else{
      this.showAuthentificationMessage();
    }
  }

  showAuthentificationMessage(){
    const dialog = this.dialog.open( NotConnectedComponent , {
      data : {
        title: 'YOUR_MEET_AND_BUILD_ACCOUNT',
        content: "TO_PERFOM_THIS_ACTION_YOU_MUST_HAVE_AN_ENTREPRENEUR_ACCOUNT_AND_BE_IDENTIFIED_ON_THE_SITE",
        confirmBtn: 'REGISTRATION',
        cancelBtn: 'CONNECTION' 
      },
      width: '500px',
      height: 'auto',
    });
    dialog.afterClosed().subscribe(result => {
      if(result && result.confirm){
          
      }
    })
  }

}
