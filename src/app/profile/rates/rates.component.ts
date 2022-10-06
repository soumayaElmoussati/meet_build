import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss']
})
export class RatesComponent implements OnInit {

  profileSlug: any;
  rates: any;
  profile: any;
  profileImgUrl = environment.profileImgUrl;
  profileId: any;
  currentPage = 1;

  constructor(
    private route: ActivatedRoute,
    private profileS: ProfileService
  ) {
    this.route.parent.params.subscribe(
      (params) => {
        this.profileSlug = params.profile;
      }
    )
  }

  ngOnInit(): void {
    this.getIdFromSlug(); 
  }

  
  getIdFromSlug(){
    let rdata;
    this.profileS.idFromSlug(this.profileSlug).subscribe(
      data => {
        rdata = data;
        this.profileId = rdata.id;
      },
      error =>{ console.log(error) },
      () => {
        this.getProfileRates();
      }
    )
  }

  getProfileRates(){
    this.profileS.rate(this.profileId, 3, this.currentPage).subscribe(
      data => {
        this.rates = data;
      },
      error => {},
      () => {
      }
    )
  }

  navigateTo(page){
    this.currentPage = page;
    this.getProfileRates();
  }
}
