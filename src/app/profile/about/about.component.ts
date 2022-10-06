import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  profileSlug: any;
  profile: any;
  profileId: any;

  constructor(
    private route: ActivatedRoute,
    private profileS: ProfileService,
    private title: Title,
    private meta: Meta,
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
        this.getProfileInfo();
      }
    )
  }

  getProfileInfo(){
    this.profileS.about(this.profileId).subscribe(
      data => {
        this.profile = data.data;
        console.log(this.profile);
        this.title.setTitle(this.profile.company_name);
        this.meta.updateTag({property: 'og:title', content: this.profile.company_name});
        this.meta.updateTag({property: 'og:description', content: this.profile.presentation});
      },
      error => {},
      () => {}
    )
  }


}
