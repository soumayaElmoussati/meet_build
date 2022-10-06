import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { ProjectService } from 'src/app/shared/services/project.service';
import { JobService } from 'src/app/shared/services/job.service';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { CountriesService } from '../shared/services/countries.service';
import { ProfileService } from '../shared/services/profile.service';
import { CurrentPageService } from '../shared/services/current-page.service';
import { TokenService } from '../shared/services/token.service';
import { NotConnectedComponent } from '../shared/dialogs/not-connected/not-connected.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class JobsComponent implements OnInit {

  jobCategories: any;
  jobContractTypes: any;
  selectedCategory = 'all';
  jobsList: any;
  currentPage = 1;
  pagination = [];
  results = [5, 10, 25, 50, 100];
  resultPerPage = new FormControl(4);
  selectedContractType = new FormControl();
  orderBy = new FormControl('DESCENDING');
  display = false;
  orderByOptions = [ 'ASCENDING', 'DESCENDING' ];
  provincesList =  null;
  isConnected: boolean;

  searchForm = new FormGroup({
    request: new FormControl('', Validators.required),
    province: new FormControl('', Validators.required)
  })

  constructor(
    private router: Router,
    private jobS: JobService,
    private profileS: ProfileService,
    private currentPageS: CurrentPageService,
    private tokenS: TokenService,
    private dialog: MatDialog
  ) {
    this.isConnected = this.tokenS.loggedIn();
  }

  ngOnInit(): void {
    this.currentPageS.currentLink.next('jobboard');
    this.getJobsCategories();
    this.getLastJobs();
    this.getAllProvinces();
  }

  getAllProvinces(){
    this.profileS.getProvinces().subscribe(
      data => { this.provincesList = data.data;}
    )
  }
  getJobsCategories(){
    this.jobS.getCategories().subscribe(
      data => { this.jobCategories = data;}
    )
  }

  getLastJobs(){
    this.jobS.getLastJobs(
      this.selectedCategory,
    ).subscribe(
      data => { this.jobsList = data ;
              },
      error => {},
      () => {}
    )
  }
  onSelectedCategorieValueChanged(){
    this.getLastJobs();
  }
  counter(i: number) {
    return new Array(i);
  }

  onSearchFormSubmit(){
    this.jobS.dataFiltre.next( this.searchForm.value );
    this.router.navigateByUrl('/jobs/list/tous-jobs');
  }

  navigateToJobDetail(slug){
    this.router.navigateByUrl('/jobs/' + slug);
  }

  navigateToJob(element){
    this.jobS.dataFiltre.next( element );
  }

  navigateToViewProfiles(){
    if( this.tokenS.loggedIn() && this.tokenS.getRole()?.includes('mission') ){
      this.router.navigateByUrl('/cv/list');
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
        cancelBtn: 'CONNECTION',
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