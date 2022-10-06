import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { BehaviorSubject } from 'rxjs';
import { AdminService } from 'src/app/shared/services/admin.service';
import { TokenService } from 'src/app/shared/services/token.service';

@Component({
  selector: 'app-admin-core',
  templateUrl: './admin-core.component.html',
  styleUrls: ['./../admin.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'admin'
    }
  ]
})
export class AdminCoreComponent implements OnInit {

  isExpanded = true;
  pageTitle: string;
  pageSubTitle: string;
  backTo: string;
  subMenu = 0;
  currentLink = { parrent: 0, child : 0};
  showSubMenu = false;

  constructor(
    private adminS: AdminService,
    private router: Router,
    private tokenS: TokenService
  ) {}

  ngOnInit(): void {
    this.adminS.currentdataTitle.subscribe( data => this.pageTitle = data );
    this.adminS.currentdataSubTitle.subscribe( data => this.pageSubTitle = data );
    this.adminS.currentdataBackTo.subscribe( data => this.backTo = data );
    this.adminS.currentLinkParam.subscribe( data => this.currentLink = data );
  }

  logOut(){
    this.tokenS.remove();
    this.router.navigateByUrl('/login');
  }

}
