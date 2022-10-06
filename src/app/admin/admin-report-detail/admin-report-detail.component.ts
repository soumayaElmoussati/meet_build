import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { BehaviorSubject } from 'rxjs';
import { AdminService } from 'src/app/shared/services/admin.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-admin-report-detail',
  templateUrl: './admin-report-detail.component.html',
  styleUrls: ['./../admin.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'admin'
    }
  ]
})
export class AdminReportDetailComponent implements OnInit {

  type: string;
  oldType: string;
  typeParam = new BehaviorSubject<string>("");
  changeVar = this.typeParam.asObservable();
  reportId: string;
  profileImgUrl = environment.profileImgUrl;
  baseUrl = environment.baseUrl;
  reportDetail = null;
  prefix = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminS: AdminService,
    private translocoS: TranslocoService
  ) {
    this.route.paramMap.subscribe( params => {
      this.typeParam.next(params.get('type'));
      this.reportId = params.get('id');
    } )
  }

  ngOnInit(): void {
    this.changeVar.subscribe( data => {
      this.type = data;
      this.oldType = this.type;
      switch(this.type){
        case 'projets': this.type = 'PROJECTS'; this.prefix = 'projets/'; this.adminS.currentLinkParam.next({ parent:3, child:1 }); break;
        case 'profils': this.type = 'PROFILES'; this.prefix = ''; this.adminS.currentLinkParam.next({ parent:3, child:2 }); break;
        case 'annonces': this.type = 'JOBS'; this.prefix = 'jobs/'; this.adminS.currentLinkParam.next({ parent:3, child:3 }); break;
        case 'publications': this.type = 'PUBLICATIONS'; this.prefix = ''; this.adminS.currentLinkParam.next({ parent:3, child:4 }); break;
      };
      this.getReport();
      this.translocoS.selectTranslate('REPORT_DETAIL', null, 'admin').subscribe(value => this.adminS.dataTitle.next(value));
      this.adminS.dataSubTitle.next(null);
      this.adminS.dataBackTo.next('/admin/signalements/'+this.oldType);
    } );
  }

  getReport(){
    const data = {
      report_id: this.reportId,
      report_type: this.type
    };
    this.adminS.getReport(data).subscribe( data => this.reportDetail = data.data );
  }

  sendAlert(){
    this.router.navigateByUrl('/admin/envoyer-une-alerte/'+this.reportDetail.reported_email); 
  }
  block(){
    this.adminS.changeUserStatus(this.reportDetail.reported_id).subscribe(
      data => {
        this.reportDetail.status = data.status;
      }
    )
  }
  archive(){
    const data = {
      report_id: this.reportId,
      report_type: this.type
    };
    this.adminS.archive(data).subscribe( data => this.reportDetail.archived = data.archived );
  }


}
