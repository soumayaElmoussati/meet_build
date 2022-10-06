import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { BehaviorSubject } from 'rxjs';
import { AdminService } from 'src/app/shared/services/admin.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./../admin.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'admin'
    }
  ]
})
export class AdminReportComponent implements OnInit {

  baseUrl = environment.baseUrl;
  profileImgUrl = environment.profileImgUrl;
  reportsList: any;
  displayedColumns: string[] = ['reported_by', 'name', 'about', 'reason', 'action'];
  reportsDataSource = new MatTableDataSource(<any>[]);
  currentPage: number = 1;
  pagination = [];
  perPage: number = 9;
  search = new FormControl('');
  archived = new FormControl(false);
  order = new FormControl('ALPHABETICAL');
  type: string;
  oldType: string;
  prefix = '';

  typeParam = new BehaviorSubject<string>("");
  changeVar = this.typeParam.asObservable();

  constructor(
    private adminS: AdminService,
    private translocoS: TranslocoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe( params => {
      this.typeParam.next(params.get('type'));
    } )
  }

  ngOnInit(): void {
    this.changeVar.subscribe( data => {
      this.currentPage = 1;
      this.type = data;
      this.oldType = data;
      switch(this.type){
        case 'projets': this.type = 'PROJECTS'; this.prefix = 'projets/'; this.adminS.currentLinkParam.next({ parent:3, child:1 }); break;
        case 'profils': this.type = 'PROFILES'; this.prefix = ''; this.adminS.currentLinkParam.next({ parent:3, child:2 }); break;
        case 'annonces': this.type = 'JOBS'; this.prefix = 'jobs/'; this.adminS.currentLinkParam.next({ parent:3, child:3 }); break;
        case 'publications': this.type = 'PUBLICATIONS'; this.prefix = ''; this.adminS.currentLinkParam.next({ parent:3, child:4 }); break;
      };
      this.getReports();
      this.translocoS.selectTranslate('REPORTS_'+this.type, null, 'admin').subscribe(value => this.adminS.dataTitle.next(value));
      this.adminS.dataSubTitle.next(null);
      this.adminS.dataBackTo.next('/admin');
    } );
    this.search.valueChanges.subscribe( data => this.getReports() );
    this.order.valueChanges.subscribe( data => this.getReports() );
    this.archived.valueChanges.subscribe( data => this.getReports() );
  }

  getReports(){
    let status = [];
    const data = {
      perPage: this.perPage,
      order: this.order.value,
      search: this.search.value,
      archived: this.archived.value
    };

    this.adminS.getReports(data, this.currentPage, this.type ).subscribe(
      data => {
        this.reportsList = data;
        this.refrechDataSource();
        this.generatePagination();
      }
    )
  }
  refrechDataSource(){
    this.reportsDataSource = new MatTableDataSource(this.reportsList.data);  
  }
  generatePagination(){
    this.pagination = [];
    for( let i = 1 ; i <= this.reportsList.last_page ; i++ ){
      this.pagination.push(i);
    }
  }
  navigateTo(page){
    this.currentPage = page;
    this.getReports();
  }
  
  seeDetail(id){
    this.router.navigateByUrl('/admin/signalements/'+this.oldType+'/'+id);
  }

  archive(id){
    const data = {
      report_id: id,
      report_type: this.type
    }
    this.adminS.archive(data).subscribe( data => this.getReports() );
  }
  

}
