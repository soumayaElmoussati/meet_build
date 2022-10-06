import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ConversationService } from 'src/app/shared/services/conversation.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { ProjectService } from 'src/app/shared/services/project.service';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss']
})
export class MyProjectsComponent implements OnInit {

  projectCategories: any;
  projectStatus: any;
  selectedCategory = 'all';
  selectedSubCategory = '';
  showSubMenu: boolean = false;
  projectsList: any;
  currentPage = 1;
  pagination = [];
  results = [5, 10, 25, 50, 100];
  resultPerPage = new FormControl(10);
  selectedStatus = new FormControl();
  selectedDistance = new FormControl();
  orderBy = new FormControl('DESCENDING');
  month = new FormControl('all');
  province = new FormControl('all');
  provincesList: any;

  months =  [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  orderByOptions = [ 'ASCENDING', 'DESCENDING' ];
  distanceOptions = [ 
    { value: '0-10' , name: '<10' },
    { value: '10-20' , name: 'Entre 10 et 20' },
    { value: '10-0' , name: '20<' },
  ];

  activeLink = 'projects';

  constructor(
    private projectS: ProjectService,
    private profileS: ProfileService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getProjectsCategories();
    this.getAllProjects();
    this.getProjectStatus();
    this.getAllProvinces();
    this.resultPerPage.valueChanges.subscribe( data => this.getAllProjects() )
    this.selectedStatus.valueChanges.subscribe( data => this.getAllProjects() )
    this.orderBy.valueChanges.subscribe( data => this.getAllProjects() )
    this.selectedDistance.valueChanges.subscribe( data => this.getAllProjects() )
    this.province.valueChanges.subscribe( data => this.getAllProjects() )
    this.month.valueChanges.subscribe( data => this.getAllProjects() )
  }

  getAllProvinces():any{
    this.profileS.getProvinces().subscribe(
      data => {
        this.provincesList = data.data
      }
    )
  }

  onSelectedCategorieValueChanged(id){
    if(this.selectedCategory == id){
      this.showSubMenu = !this.showSubMenu;
    }else{
      this.selectedCategory = id;
      this.selectedSubCategory = 'all';
      this.getAllProjects();
      this.showSubMenu = true;
    }
  }
  onSelectedSubCategorieValueChanged(id){
    if(this.selectedSubCategory == id){
      this.selectedSubCategory = 'all'; 
    }else{
      this.selectedSubCategory = id; 
      this.getAllProjects(); 
    }
  }

  getProjectsCategories(){
    this.projectS.getCategories().subscribe(
      data => { this.projectCategories = data }
    )
  }

  getProjectStatus(){
    this.projectS.getProjectStatus().subscribe(
      data => { this.projectStatus = data;}
    )
  }

  getAllProjects(){
    this.projectS.getMyProjects(
      this.resultPerPage.value,
      this.currentPage,
      this.selectedCategory,
      this.selectedSubCategory ? this.selectedSubCategory : 'all' ,
      this.selectedStatus.value ? this.selectedStatus.value.id : 'all',
      this.orderBy.value,
      this.selectedDistance.value ? this.selectedDistance.value : 'all',
      this.province.value ? this.province.value : 'all',
      this.month.value ? this.month.value : 'all',
      ).subscribe(
      data => { this.projectsList = data },
      error => {},
      () => { this.generatePagination() }
    )
  }

  navigateTo(page){
    this.currentPage = page;
    this.getAllProjects();
  }

  generatePagination(){
    this.pagination = [];
    for( let i = 1 ; i <= this.projectsList.last_page ; i++  ){
      this.pagination.push(i);
    }
  }

  counter(i: number) {
    return new Array(i);
  }

  navigateToProjectConversations(id){
    this.router.navigateByUrl('/projet-conversations/' + id);
  }
  createProject(){
    this.router.navigateByUrl('/projet/creer?redirectTo='+this.router.url);
  }

}
