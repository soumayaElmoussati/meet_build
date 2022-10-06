import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslocoService, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { AdminService } from 'src/app/shared/services/admin.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-moderation-code-nace',
  templateUrl: './moderation-code-nace.component.html',
  styleUrls: ['./../admin.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'admin'
    }
  ]
})
export class ModerationCodeNaceComponent implements OnInit {

  profileImgUrl = environment.profileImgUrl;
  codeNacesList: any;
  displayedColumns: string[] = ['added_by', 'name', 'code', 'description', 'status', 'action'];
  codeNaceDataSource = new MatTableDataSource(<any>[]);
  currentPage: number = 1;
  pagination = [];
  perPage: number = 9;
  search = new FormControl('');
  order = new FormControl('ALPHABETICAL');
  statusDisabled = new FormControl(true);
  statusEnabled = new FormControl(true);
  statusIgnored = new FormControl(false);
  
  constructor(
    private adminS: AdminService,
    private translocoS: TranslocoService,
    private router: Router
  ) {
    this.translocoS.selectTranslate('NEW_NACE_CODE', null, 'admin').subscribe(value => this.adminS.dataTitle.next(value));
    this.adminS.dataSubTitle.next(null);
    this.adminS.dataBackTo.next('/admin');
    this.adminS.currentLinkParam.next({ parent:5, child:3 });
  }

  ngOnInit(): void {
    this.getUsers();
    this.search.valueChanges.subscribe( data => this.getUsers() );
    this.order.valueChanges.subscribe( data => this.getUsers() );
    this.statusDisabled.valueChanges.subscribe( data => this.getUsers() );
    this.statusEnabled.valueChanges.subscribe( data => this.getUsers() );
    this.statusIgnored.valueChanges.subscribe( data => this.getUsers() );
  }

  getUsers(){
    let status = [];
    if(this.statusEnabled.value) status.push('1');
    if(this.statusDisabled.value) status.push('0');
    if(this.statusIgnored.value) status.push('2');

    const data = {
      perPage: this.perPage,
      order: this.order.value,
      status: status,
      search: this.search.value
    };

    this.adminS.getNewCodeNaces(data, this.currentPage ).subscribe(
      data => {
        this.codeNacesList = data;
        this.refrechDataSource();
        this.generatePagination();
      }
    )
  }
  refrechDataSource(){
    this.codeNaceDataSource = new MatTableDataSource(this.codeNacesList.data);  
  }
  generatePagination(){
    this.pagination = [];
    for( let i = 1 ; i <= this.codeNacesList.last_page ; i++ ){
      this.pagination.push(i);
    }
  }
  navigateTo(page){
    this.currentPage = page;
    this.getUsers();
  }
  changeUserStatus(element, index:number, status:number){ 
    if(status == 1 && !element.hasSubCategory ) {
      this.router.navigateByUrl('/admin/moderation/code-nace/affectation/'+element.id+'/'+element.description);
      return;
    }
    const data = {
      id: element.id,
      status: status
    }
    this.adminS.changeCodeNaceStatus(data).subscribe(
      data => {
        this.codeNacesList.data[index].status = data.status;
        this.refrechDataSource();
      }
    )
  }

}
