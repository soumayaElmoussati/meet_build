import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import { JobService } from 'src/app/shared/services/job.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-created-jobs',
  templateUrl: './created-jobs.component.html',
  styleUrls: ['./created-jobs.component.scss']
})
export class CreatedJobsComponent implements OnInit {

  profileSlug: any;
  annonces: any;
  profileId: any;
  currentPage = 1;
  profile = [];

  constructor(
    private route: ActivatedRoute,
    private profileS: ProfileService,
    private jobS: JobService,
    private helpersS: HelpersService, // used on component
  ) {
    this.route.paramMap.subscribe(params => {
      this.profileSlug = params.get('profile');
    });
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
        this.getProfileAnnonce();
      }
    )
  }

  getProfileInfo(){
    this.profileS.about(this.profileId).subscribe(
      data => {
        this.profile = data;
      },
      error => {},
      () => {}
    )
  }

  getProfileAnnonce(){
    this.jobS.jobs(this.profileId, 3, this.currentPage).subscribe(
      data => {
        this.annonces = data;
      },
      error => {},
      () => {
        
      }
    )
  }
 
  navigateTo(page){
    this.currentPage = page;
    this.getProfileAnnonce();
  }

}
