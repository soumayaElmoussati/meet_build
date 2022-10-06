import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentPageService } from 'src/app/shared/services/current-page.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-favorite-profile',
  templateUrl: './favorite-profile.component.html',
  styleUrls: ['./favorite-profile.component.scss']
})
export class FavoriteProfileComponent implements OnInit {

  profileSlug: string;
  profileId: string;
  profile = null;
  currentPage = 1;
  perPage = 12;
  favoriteProfiles: any;
  profileImgUrl = environment.profileImgUrl;
  noPicture = this.profileImgUrl + 'no-picture.jpg';
  loading = true;

  constructor(
    private profileS: ProfileService,
    private router: Router,
    private tokenS: TokenService,
    private currentPageS: CurrentPageService
  ) {
    this.profileId = this.tokenS.getId();
    this.profileSlug = this.tokenS.getSlug();
  }

  ngOnInit(): void {
    this.currentPageS.meCurrentLink.next('favoris');
    this.getFavoriteProfiles();
  }

  getFavoriteProfiles(){
    this.profileS.getFavoriteProfiles(this.perPage, this.currentPage).subscribe(
      data => { this.favoriteProfiles = data ; this.loading = false }
    )
  }

  navigateTo(page){
    this.currentPage = page;
    this.getFavoriteProfiles();
  }

  setRouter(path){
    this.router.navigateByUrl(path)
  }

}
