import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslocoService, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { environment } from 'src/environments/environment.prod';
import { AdminService } from './../../shared/services/admin.service';

@Component({
  selector: 'app-moderation-users',
  templateUrl: './moderation-users.component.html',
  styleUrls: ['./../admin.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'admin'
    }
  ]
})
export class ModerationUsersComponent implements OnInit {

  profileImgUrl = environment.profileImgUrl;
  usersList: any;
  displayedColumns: string[] = ['picture', 'name', 'address', 'phone', 'date', 'status', 'action'];
  usersDataSource = new MatTableDataSource(<any>[]);
  currentPage: number = 1;
  pagination = [];
  perPage: number = 9;
  search = new FormControl('');
  order = new FormControl('ALPHABETICAL');
  statusDisabled = new FormControl(true);
  statusEnabled = new FormControl(true);
  mission = new FormControl(true);
  job = new FormControl(true);

  constructor(
    private adminS: AdminService,
    private translocoS: TranslocoService,
    private router: Router,
  ) {
    this.translocoS.selectTranslate('USERS_MODERATION', null, 'admin').subscribe(value => this.adminS.dataTitle.next(value));
    this.adminS.dataSubTitle.next(null);
    this.adminS.dataBackTo.next('/admin');
    this.adminS.currentLinkParam.next({ parent:5, child:1 });
  }

  ngOnInit(): void {
    this.getUsers();
    this.search.valueChanges.subscribe( data => this.getUsers() );
    this.order.valueChanges.subscribe( data => this.getUsers() );
    this.statusDisabled.valueChanges.subscribe( data => this.getUsers() );
    this.statusEnabled.valueChanges.subscribe( data => this.getUsers() );
    this.mission.valueChanges.subscribe( data => this.getUsers() );
    this.job.valueChanges.subscribe( data => this.getUsers() );
  }

  getUsers(){
    let status = [];
    if(this.statusEnabled.value) status.push('1');
    if(this.statusDisabled.value) status.push('0');
    let role = [];
    if(this.mission.value) role.push('mission');
    if(this.job.value) role.push('job');

    const data = {
      perPage: this.perPage,
      order: this.order.value,
      status: status,
      role: role,
      search: this.search.value
    };

    this.adminS.getUsers(data, this.currentPage ).subscribe(
      data => {
        this.usersList = data;
        this.refrechDataSource();
        this.generatePagination();
      }
    )
  }
  refrechDataSource(){
    this.usersDataSource = new MatTableDataSource(this.usersList.data);  
  }
  generatePagination(){
    this.pagination = [];
    for( let i = 1 ; i <= this.usersList.last_page ; i++ ){
      this.pagination.push(i);
    }
  }
  navigateTo(page){
    this.currentPage = page;
    this.getUsers();
  }
  changeUserStatus(id, index){ 
    this.adminS.changeUserStatus(id).subscribe(
      data => {
        this.usersList.data[index].status = data.status;
        this.refrechDataSource();
      }
    )
  }
  
  seeProfile(index){
    if(this.usersList.data[index].subscribed_to == 'mission'){
      this.router.navigateByUrl('/'+this.usersList.data[index].slug);
    }else if(this.usersList.data[index].subscribed_to == 'job'){

    }
  }
  sendAlert(email){
    this.router.navigateByUrl('/admin/envoyer-une-alerte/'+email);
  }



}
