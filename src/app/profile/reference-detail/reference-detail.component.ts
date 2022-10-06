import { ValueTransformer } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-reference-detail',
  templateUrl: './reference-detail.component.html',
  styleUrls: ['./reference-detail.component.scss']
})
export class ReferenceDetailComponent implements OnInit {

  profileSlug: any;
  referenceId: any;
  profile: any;
  reference: any;
  referenceImgUrl = environment.referenceImgUrl;
  profileId: any;

  constructor(
    private route: ActivatedRoute,
    private profileS: ProfileService,
    private title: Title,
    private meta: Meta
  ) {
    this.route.paramMap.subscribe(params => {
      this.profileSlug = params.get('profile');
      this.referenceId = params.get('id');
    });
  }

  ngOnInit(): void {
    this.getIdFromSlug();
    this.getReferenceDetail();
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
      },
      error => {},
      () => {}
    )
  }

  getReferenceDetail(){
    this.profileS.referencesDetail(this.referenceId).subscribe(
      data => { 
        this.reference = data.data
        this.title.setTitle(this.reference.title);
        this.meta.updateTag({property: 'og:title', content: this.reference.title});
        this.meta.updateTag({property: 'og:description', content: this.reference.description});
       },
      error => {},
      () => {}
    )
  }

}
