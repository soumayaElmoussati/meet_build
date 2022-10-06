import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { CurrentPageService } from '../shared/services/current-page.service';
import { ProfileService } from '../shared/services/profile.service';
import { ProjectService } from './../shared/services/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projectCategories: any;
  projectStatus: any;
  provincesList: any;
  selectedCategory = 'all';
  selectedSubCategory = '';
  showSubMenu: boolean = false;
  SubCategory = '';
  projectsList: any;
  currentPage:number = 1;
  pagination = [];
  results = [5, 10, 25, 50, 100];
  resultPerPage = new FormControl(5);
  selectedStatus = new FormControl();
  orderBy = new FormControl('DESCENDING');
  month = new FormControl('all');
  province = new FormControl('all');

  months =  [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  orderByOptions = [ 'ASCENDING', 'DESCENDING' ];

  constructor(
    private projectS: ProjectService,
    private router: Router,
    private profileS: ProfileService,
    private currentPageS: CurrentPageService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(
      param => {
        if(param.page) this.navigateTo(param.page)
      }
    )
  }

  ngOnInit(): void {
    this.currentPageS.currentLink.next('projets');
    this.getProjectsCategories();
    this.getAllProjects();
    this.getProjectStatus();
    this.getAllProvinces();
    this.resultPerPage.valueChanges.subscribe( data => this.getAllProjects() )
    this.selectedStatus.valueChanges.subscribe( data => this.getAllProjects() )
    this.orderBy.valueChanges.subscribe( data => this.getAllProjects() )
    this.month.valueChanges.subscribe( data => this.getAllProjects() )
    this.province.valueChanges.subscribe( data => this.getAllProjects() )
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
    this.projectS.getAllProjects(
      this.resultPerPage.value,
      this.currentPage,
      this.selectedCategory,
      this.selectedSubCategory ? this.selectedSubCategory : 'all',
      this.selectedStatus.value ? this.selectedStatus.value.id : 'all',
      this.month.value ? this.month.value : 'all',
      this.province.value ? this.province.value : 'all',
      this.orderBy.value
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

  navigateToProject(slug){
    this.router.navigateByUrl('/projets/' + slug);
  }
  createProject(){
    this.router.navigateByUrl('/projet/creer?redirectTo='+this.router.url);
  }
  
  setRouter(path){
    this.router.navigateByUrl(path);
  }

  nextPage(): number{
    if(this.currentPage < this.projectsList.last_page) return +this.currentPage + 1;
    else return this.currentPage;
  }
  prevPage(): number{
    if(this.currentPage > 1 ) return +this.currentPage - 1;
    else return this.currentPage;
  }

}
