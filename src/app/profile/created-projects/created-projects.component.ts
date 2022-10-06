import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { HelpersService } from 'src/app/shared/services/helpers.service';

@Component({
  selector: 'app-created-projects',
  templateUrl: './created-projects.component.html',
  styleUrls: ['./created-projects.component.scss']
})
export class CreatedProjectsComponent implements OnInit {

  profileSlug: any;
  projects: any;
  profileId: any;
  currentPage = 1;
  profile = [];

  constructor(
    private route: ActivatedRoute,
    private profileS: ProfileService,
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
        this.getProfileProjects();
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

  getProfileProjects(){
    this.profileS.projects(this.profileId, 3, this.currentPage).subscribe(
      data => {
        this.projects = data;
      },
      error => {},
      () => {
      }
    )
  }
 
  navigateTo(page){
    this.currentPage = page;
    this.getProfileProjects();
  }

}
