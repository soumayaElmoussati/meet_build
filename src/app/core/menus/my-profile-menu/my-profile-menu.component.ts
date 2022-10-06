import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CurrentPageService } from 'src/app/shared/services/current-page.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-my-profile-menu',
  templateUrl: './my-profile-menu.component.html',
  styleUrls: ['./../profile-menu/profile-menu.component.scss']
})
export class MyProfileMenuComponent implements OnInit {

  @Input() profile;
  profileImgUrl = environment.profileImgUrl;
  activeLink = "";
  role: any;
  
  constructor(
    private profileS: ProfileService,
    private currentPageS: CurrentPageService,
    private tokenS: TokenService,
    private authS: AuthService
  ) {
  }

  ngOnInit(): void {
    this.authS.newUserRole.subscribe( data => {
      if(data?.includes('job')){
        this.role = 'job'
      }else{
        this.role = 'mission'
      }
    } )
    this.currentPageS.newMeCurrentLink.subscribe(
      data => { if(data) this.activeLink = data }
    )
  }

  onChange(){
    //if(this.profile) console.log(this.profile.profile_picture);
  }

}
