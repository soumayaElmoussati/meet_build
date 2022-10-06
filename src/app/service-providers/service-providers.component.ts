import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { CurrentPageService } from '../shared/services/current-page.service';
import { ProfileService } from '../shared/services/profile.service';

@Component({
  selector: 'app-service-providers',
  templateUrl: './service-providers.component.html',
  styleUrls: ['./service-providers.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class ServiceProvidersComponent implements OnInit {

  serviceProviders: any;
  competences: any;
  provinces: any;
  currentPage = 1;
  pagination = [];
  results = [8, 12, 24, 48];
  resultPerPage = new FormControl(8);
  selectedStatus = new FormControl();
  competence = new FormControl();
  company_name = new FormControl();
  filteredCompetences: any;
  competenceFilter = new FormControl('');
  province = new FormControl();
  orderBy = new FormControl('DESCENDING');
  orderByOptions = ['ASCENDING', 'DESCENDING'];

  opened: boolean;
  phoneMenu: boolean = false;
  constructor(
    private profileS: ProfileService,
    private currentPageS: CurrentPageService,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta,
  ) {
    this.route.queryParams.subscribe(
      param => { 
        if(param.page){
          this.navigateTo(param.page)
        }
       }
    )
  }

  ngOnInit(): void {
    this.title.setTitle('TITLE_LIST_DES_PRESTATAIRES');
    this.meta.updateTag({property: 'og:title', content: 'TITLE_LIST_DES_PRESTATAIRES'});
    this.meta.updateTag({property: 'og:description', content: 'TITLE_LIST_DES_PRESTATAIRES'});

    this.currentPageS.currentLink.next('prestataires');
    this.getServiceProviders();
    this.getAllCompetences();
    this.getAllProvinces();
    this.resultPerPage.valueChanges.subscribe(data => this.getServiceProviders());
    this.orderBy.valueChanges.subscribe(data => this.getServiceProviders());
    this.competence.valueChanges.subscribe(data => this.getServiceProviders());
    this.province.valueChanges.subscribe(data => this.getServiceProviders());
    this.competenceFilter.valueChanges.subscribe(data => this.filterCompetences());
    this.company_name.valueChanges.subscribe(data => this.getServiceProviders());
  }


  filterCompetences() {

    if (this.competenceFilter?.value.length == 0) {
      this.filteredCompetences = this.competences;
    }
    else {
      this.filteredCompetences = this.competences.filter(
        competence => competence.name.toLowerCase().indexOf(this.competenceFilter.value) > -1
      )
    }


  }

  getServiceProviders() {
    const data = {
      company_name: this.company_name.value,
      experience_years: null,
      city: null,
      order: this.orderBy.value,
      competence: this.competence.value,
      province: this.province.value,
      perPage: this.resultPerPage.value,
      currentPage: this.currentPage
    }
    this.profileS.getAllServiceProviders(data).subscribe(
      data => { this.serviceProviders = data; this.generatePagination(); }
    )
  }

  getAllCompetences(): any {
    this.profileS.getAllCompetences().subscribe(
      data => {
        this.competences = data.data;
        this.filterCompetences();
      }
    )
  }
  getAllProvinces(): any {
    this.profileS.getProvinces().subscribe(
      data => {
        this.provinces = data.data
      }
    )
  }

  generatePagination() {
    this.pagination = [];
    for (let i = 1; i <= this.serviceProviders.last_page; i++) {
      this.pagination.push(i);
    }
  }

  navigateTo(page) {
    this.currentPage = page;
    this.getServiceProviders();
  }
  nextPage(): number{
    if(this.currentPage < this.serviceProviders.last_page) return +this.currentPage + 1;
    else return this.currentPage;
  }
  prevPage(): number{
    if(this.currentPage > 1 ) return +this.currentPage - 1;
    else return this.currentPage;
  }

  menuStatusChange(opened) {
    this.opened = opened;
  }

  phoneMenuStatus(opened) {
    this.phoneMenu = opened;
  }


}
