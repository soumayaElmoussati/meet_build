import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslocoService, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { environment } from 'src/environments/environment.prod';
import { AdminService } from '../shared/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'admin'
    }
  ]
})
  
export class AdminComponent implements OnInit {

  statisticsData = {
    nbrNewUsers: '-',
    nbrNewProjects: '-',
    providers: '-',
    nbrNewPosts: '-',
    nbrNewCvs: '-',
    postedPublications: '-',
    allUsers: '-',
    totalAmount: '-',
    yearAmount: '-',
    monthAmount: '-',
    nbrNewJobs: '-',
    nbrUsers: '-',
    newCvProportion: '',
    newJobsProportion: '',
    newPostsProportion: '',
    newProjectsProportion: '',
    allUsersProportion: '',
    newUsersProportion: ''
  }
  chartReady = true;
  filtre = new FormControl('month');
  currentPage = 1;
  perPage = 200;
  users = [];
  usersData = [];
  profileImgUrl = environment.profileImgUrl;
  loadData:boolean = false;
 
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      position: "bottom",
    }
  };
  public barChartLabels = [];
  public dataJobs = [];
  public dataProjects = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [];
 
 
  constructor(
    private adminS: AdminService,
    private translocoS: TranslocoService
  ) {
    this.translocoS.selectTranslate('DASHBOARD', null, 'admin').subscribe(value => this.adminS.dataTitle.next(value));
    this.translocoS.selectTranslate('HAPPY_TO_SEE_YOU_AGAIN', {name: 'Nom'} , 'admin').subscribe(value => this.adminS.dataSubTitle.next(value));
    this.adminS.dataBackTo.next(null);
    this.adminS.currentLinkParam.next({ parent:1, child:0 });
  }
  ngOnInit(): void {
    this.getStatistics();
    this.getChartData();
    this.getRecentUsers();
    this.filtre.valueChanges.subscribe( data => this.getChartData() )
  }

  formatDate(data): string{
    const date = data.split('-');
    return date[2] + ' ' + this.translocoS.translate('MONTH_'+date[1])  + ' ' + date[0];
  }
  formatDateMonth(data): string{
    const date = data.split('-');
    return this.translocoS.translate('MONTH_'+date[0])  + ' ' + date[1];
  }

  getStatistics(){
    this.adminS.getStatistics().subscribe(
      data => { 
        this.statisticsData = data ;
      }
    )
  }

  getChartData(){
    this.adminS.getChartData(this.filtre.value).subscribe(
      data => {
        this.dataJobs = data.jobs;
        this.dataProjects = data.projects;
        this.barChartLabels = [];
        if(this.filtre.value == 'day'){
          data.interval.forEach(element => {
            this.barChartLabels.push( this.formatDate(element) )
          });
        }else if(this.filtre.value == 'month'){
          data.interval.forEach(element => {
            this.barChartLabels.push( this.formatDateMonth(element) )
          });
        }else{
          this.barChartLabels = data.interval;
        }
        this.generateChart();
      }
    )
  }

  generateChart(){
    this.barChartData = [
      {
        data: this.dataJobs,
        type: 'bar',
        label: 'Projets',
        barThickness: 5,
        backgroundColor: '#113B3A'
      },
      {
        data: this.dataProjects,
        type:'line',
        label: 'Jobs',
        fill: false,
        borderColor: '#FFA726',
        borderDash: [5,5]
      }
    ];
  }

  getRecentUsers(){
    this.adminS.getRecentUsers(this.perPage, this.currentPage).subscribe(
      data => {
        this.users = data;
        this.usersData = data.data;
      }
    )
  }

  onScrollDown(){
    this.loadData = true;
    this.currentPage++;
    this.getRecentUsers(); 
  }

}
