import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-make-review',
  templateUrl: './make-review.component.html',
  styleUrls: ['./make-review.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class MakeReviewComponent implements OnInit {

  profileId: string = '';
  requestId: string = '';
  profile: any;
  profileImgUrl = environment.profileImgUrl;
  alreadyRated: boolean = false;

  contactFormSubmitting = false;
  success = false;
  contactForm = new FormGroup({
    profileId: new FormControl(''),
    requestId: new FormControl(''),
    score: new FormControl(''),
    name: new FormControl(''),
    review: new FormControl(''),
  }); 

  constructor(
    private route: ActivatedRoute,
    private profileS: ProfileService
  ) {
    this.route.paramMap.subscribe(params => {
      this.profileId = params.get('id');
      this.requestId = params.get('request_id');
      this.contactForm.get('profileId').setValue(this.profileId);
      this.contactForm.get('requestId').setValue(this.requestId);
    });
  }

  ngOnInit(): void {
    this.getProfileInfo();
    this.isAlreadyRated();
  }

  getProfileInfo(){
    this.profileS.about(this.profileId).subscribe(
      data => {this.profile = data.data;},
      error =>{},
      () => {}
    )
  }

  onContactFormSubmit(){
    if( this.contactForm.valid ){
      this.contactFormSubmitting = true;
      this.profileS.evaluat(this.contactForm.value).subscribe(
        data => { this.contactFormSubmitting = false; this.success = true },
        error => { this.contactFormSubmitting = false }
      )
    }
  }

  isAlreadyRated(){
    this.profileS.alreadyRated(this.requestId).subscribe(
      data => { this.alreadyRated = data.response }
    )
  }

  

}
