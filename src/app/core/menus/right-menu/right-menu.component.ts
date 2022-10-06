import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-right-menu',
  templateUrl: './right-menu.component.html',
  styleUrls: ['./right-menu.component.scss']
})
export class RightMenuComponent implements OnInit {

  profile = null;
  profileImgUrl = environment.profileImgUrl;
  profileId: string;
  role: string;

  constructor(
    private tokenS: TokenService,
    private router: Router,
    private profileS: ProfileService,
    private authS: AuthService
  ) {
    this.profileId = this.tokenS.getId();
  }

  ngOnInit(): void {
    this.getProfileInfo();
    this.authS.newUserRole.subscribe( data => {
      if(data?.includes('job')){
        this.role = 'job'
      }else{
        this.role = 'mission'
      }
    } )

  }

  logOut(){
    this.tokenS.remove();
    this.router.navigateByUrl('/login');
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



}
