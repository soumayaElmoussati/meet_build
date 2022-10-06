import { ProfileService } from './../../shared/services/profile.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SendMessageComponent } from 'src/app/shared/dialogs/send-message/send-message.component';

@Component({
  selector: 'app-profile-home',
  templateUrl: './profile-home.component.html',
  styleUrls: ['./profile-home.component.scss']
})
export class ProfileHomeComponent implements OnInit {

  
  profileSlug: any;
  profileId: any;
  profile: any;
  profileStatistics = [];
  profileReferences = [];
  profileImgUrl = environment.profileImgUrl;
  referenceImgUrl = environment.referenceImgUrl;
  opened: boolean;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  constructor(
    private profileS: ProfileService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.route.paramMap.subscribe(params => {
      this.profileSlug = params.get('profile');
    });
  }

  ngOnInit(): void {
    this.getIdFromSlug();
  }

  getIdFromSlug(){
    let rdata;
    this.profileS.idFromSlug(this.profileSlug).subscribe(
      data => {
        rdata = data;
        this.profileId = rdata.id;
      },
      error =>{ console.log(error) },
      () => {
        this.getProfileInfo();
        this.getProfileStatistics();
        this.getProfileReferences();
      }
    )
  }

  getProfileInfo(){
    this.profileS.about(this.profileId, true).subscribe(
      data => {
        this.profile = data.data;
      },
      error =>{},
      () => {
        
      }
    )
  }

  getProfileStatistics(){
    this.profileS.statistics(this.profileId).subscribe(
      data => {
        this.profileStatistics = data;
      }
    )
  }

  
  getProfileReferences(){
    this.profileS.references(this.profileId).subscribe(
      data => {
        this.profileReferences = data.data;
      },
      error => { console.log(error) },
      () => {}
    )
  }

  reportProfile(){
     
  }

  /*
  isLinkActive(link) {
    const url: string = this.router.url;
    return url.search(link) !== -1;
  }
  */

  setRouter(path){
    this.router.navigateByUrl(path);
  }

  sendMessage(){
    const dialog = this.dialog.open( SendMessageComponent , {
      data : {
        title: 'SEND_A_MESSAGE',
        profile_id: this.profileId,
        confirmBtn: 'SEND',
        cancelBtn: 'CANCEL' 
      },
      width: '500px',
      height: 'auto',
      disableClose: true
    });
    dialog.afterClosed().subscribe(result => {
      if(result && result.confirm){
         
      }
    })
  }


 
  menuStatusChange(opened){
    this.opened = opened;
  }




}
