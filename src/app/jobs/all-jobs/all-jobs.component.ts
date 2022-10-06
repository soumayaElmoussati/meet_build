import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProjectService } from 'src/app/shared/services/project.service';
import { JobService } from 'src/app/shared/services/job.service';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CountriesService } from 'src/app/shared/services/countries.service';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { CurrentPageService } from 'src/app/shared/services/current-page.service';

@Component({
  selector: 'app-all-jobs',
  templateUrl: './all-jobs.component.html',
  styleUrls: ['./all-jobs.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class AllJobsComponent implements OnInit {
  categId = null;
  jobCategories: any;
  jobContractTypes: any;
  selectedCategory = 'all';
  selectedCategoryName = 'all' ;
  jobsList: any;
  currentPage = 1;
  pagination = [];
  results = [5, 10, 25, 50, 100];
  function_name = new FormControl('');
  resultPerPage = new FormControl(10);
  selectedContractType = new FormControl();
  selectedProvince = new FormControl('');
  orderBy = new FormControl('DESCENDING');
  display = true;
  orderByOptions = [ 'ASCENDING', 'DESCENDING' ];
  filtedData; 
  mine : string;
  noJobs = false;
  provincesList = [];
  search:  boolean = false;

  mineParam = new BehaviorSubject<string>("");
  changeVar = this.mineParam.asObservable();

  constructor(
    private projectS: ProjectService,
    private router: Router,
    private jobS: JobService,
    private route: ActivatedRoute,
    private countriesS: CountriesService,
    private profileS: ProfileService,
    private currentPageS: CurrentPageService
  ) {    
    this.route.paramMap.subscribe(params => {
    this.mineParam.next(params.get('mine'));
  });  
}

  ngOnInit(): void { 
    this.currentPageS.currentLink.next('jobboard');
    this.changeVar.subscribe(
      data => {
        this.mine = data;
        this.getAllJobs(false);
      }
    )
    this.jobS.currentdataFiltre.subscribe(
      data => { 
        if (data !== null) {
          if(data.id){
            this.selectedCategory = data.id;
            this.selectedCategoryName = data.name;
          }else{
            this.function_name.setValue(data.request);
            this.selectedProvince.setValue(data.province); 
          }
        }
      })
    this.getAllProvinces();
    this.getJobsCategories();
    this.getJobContractTypes();
    this.resultPerPage.valueChanges.subscribe( data => this.getAllJobs(true) );
    this.selectedContractType.valueChanges.subscribe( data => this.getAllJobs(true) );
    this.orderBy.valueChanges.subscribe( data => this.getAllJobs(true) );
    this.selectedProvince.valueChanges.subscribe( data => this.getAllJobs(true) );
    this.function_name.valueChanges.subscribe( data => this.getAllJobs(true) );
  }

  getAllProvinces(){
    this.profileS.getProvinces().subscribe(
      data => { this.provincesList = data.data },
      error => {},
      () => {
        let index;
        if(this.selectedProvince)
        index = this.provincesList.findIndex(element => element.name == this.selectedProvince.value.name);
        this.selectedProvince.setValue( this.provincesList[index] );
      }
    )
  }
  getJobsCategories(){
    this.jobS.getCategories().subscribe(
      data => { this.jobCategories = data }
    )
  }

  getAllJobs(val){
    this.search = val;
    this.jobS.getAllJobs(
      this.resultPerPage.value,
      this.currentPage,
      this.function_name.value ? this.function_name.value : 'all',
      this.selectedProvince.value ? this.selectedProvince.value.id : 'all',
      this.selectedCategory,
      this.orderBy.value,
      this.selectedContractType.value ? this.selectedContractType.value.id : 'all',
      this.mine
      ).subscribe(
      data => { this.jobsList = data ;
              },
      error => {},
      () => { 
        this.generatePagination();
        this.noJobs = false;
        if(this.jobsList.data.length == 0) this.noJobs = true;
      }
    )
  }

  generatePagination(){
    this.pagination = [];
    for( let i = 1 ; i <= this.jobsList.last_page ; i++ ){
      this.pagination.push(i);
    }
  }
  getJobContractTypes(){
    this.jobS.getContractTypes().subscribe(
      data => { this.jobContractTypes = data;}
    )
  }
  onSelectedCategorieValueChanged(){
    this.getAllJobs(true);
  }
  counter(i: number) {
    return new Array(i);
  }

  navigateToJob(slug){
    this.router.navigateByUrl('/jobs/' + slug);
  }
  navigateTo(page){
    this.currentPage = page;
    this.getAllJobs(false);
  }
}
