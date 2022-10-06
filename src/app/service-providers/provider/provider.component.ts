import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { NotConnectedComponent } from 'src/app/shared/dialogs/not-connected/not-connected.component';
import { SendMessageComponent } from 'src/app/shared/dialogs/send-message/send-message.component';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit {

  @Input() provider;
  profileImgUrl = environment.profileImgUrl;
  constructor(
    private dialog: MatDialog,
    private tokenS: TokenService,
    private profileS: ProfileService,
    private title: Title,
    private meta: Meta,
  ) { }

  ngOnInit(): void {
    
  }

  sendMessage(id){
    const dialog = this.dialog.open( SendMessageComponent , {
      data : {
        title: 'SEND_A_MESSAGE',
        profile_id: id,
        confirmBtn: 'SEND',
        cancelBtn: 'CANCEL' 
      },
      width: '500px',
      height: 'auto',
      disableClose: true
    });
    dialog.afterClosed().subscribe(result => {
      if(result && result.confirm){
         
      }
    })
  }


  followProfile(id){
    if( this.tokenS.loggedIn() && this.tokenS.getRole()?.includes('mission') ){
      this.profileS.follow(id).subscribe(
        data => {
          this.provider.follow = data.follow;
        },
        error => {},
        () => {}
      )
    }else{
      this.showAuthentificationMessage();
    }
  }

  likeProfile(id){
    if( this.tokenS.loggedIn() && this.tokenS.getRole()?.includes('mission') ){
      this.profileS.like(id).subscribe(
        data => {
          this.provider.like = data.like;
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
