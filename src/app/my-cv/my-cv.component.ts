import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import * as moment from 'moment';
import { environment } from 'src/environments/environment.prod';
import { CountriesService } from '../shared/services/countries.service';
import { JobService } from '../shared/services/job.service';
import { ProfileService } from '../shared/services/profile.service';
import { ProjectService } from '../shared/services/project.service';

@Component({
  selector: 'app-my-cv',
  templateUrl: './my-cv.component.html',
  styleUrls: ['./my-cv.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class MyCvComponent implements OnInit {
  categId = null;
  jobCategories: any;
  jobContractTypes: any;
  selectedCategory = 'all';
  selectedCategoryName = 'all' ;
  profilesList: any;
  currentPage = 1;
  pagination = [];
  results = [5, 10, 25, 50, 100];
  resultPerPage = new FormControl(10);
  selectedCity = new FormControl('');
  function_name = new FormControl('');
  orderBy = new FormControl('DESCENDING');
  display = true;
  orderByOptions = [ 'ASCENDING', 'DESCENDING' ];
  filtedData; 
  noProfiles = false;
  provincesList = null;
  profileImgUrl = environment.profileImgUrl;

  constructor(
    private profileS: ProfileService,
    private router: Router,
    private jobS: JobService,
  ) {}

  ngOnInit(): void {
 
    this.getAllProvinces();
    this.getJobsCategories();
    this.getJobProfiles();
    this.resultPerPage.valueChanges.subscribe( data => this.getJobProfiles() );
    this.orderBy.valueChanges.subscribe( data => this.getJobProfiles() );
    this.selectedCity.valueChanges.subscribe( data => this.getJobProfiles() );
  }

  getAllProvinces(){
    this.profileS.getProvinces().subscribe(
      data => { this.provincesList = data.data }
    )
  }
  getJobsCategories(){
    this.jobS.getCategories().subscribe(
      data => { this.jobCategories = data }
    )
  }

  getJobProfiles(){
    this.jobS.getJobProfiles(
      this.function_name.value ? this.function_name.value : 'all',
      this.resultPerPage.value,
      this.currentPage,
      this.selectedCity.value ? this.selectedCity.value.id : 'all',
      this.selectedCategory,
      this.orderBy.value,
      ).subscribe(
      data => { this.profilesList = data ;
              },
      error => {},
      () => { 
        this.generatePagination();
        if(this.profilesList.data.length == 0) this.noProfiles = true;
      }
    )
  }

  generatePagination(){
    this.pagination = [];
    for( let i = 1 ; i <= this.profilesList.last_page ; i++ ){
      this.pagination.push(i);
    }
  }
  onSelectedCategorieValueChanged(){
    this.getJobProfiles();
  }
  counter(i: number) {
    return new Array(i);
  }

  navigateTo(page){
    this.currentPage = page;
    this.getJobProfiles();
  }
  getYears(birthday){
    return moment(moment(),"DD/MM/YYYY").diff(moment(birthday), 'years');
  }

  downloadCV(filePath, fileName){
    this.jobS.downloadCV(filePath).subscribe(
      data => {
        let file = new Blob([<any>data], { type: 'application/pdf' });
        let url = window.URL.createObjectURL(file);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    )
  }

}
