import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { DiscussService } from 'src/app/shared/services/discuss.service';
import { AddPosteComponent } from 'src/app/discuss/add-poste/add-poste.component';

@Component({
  selector: 'app-discuss-home',
  templateUrl: './discuss-home.component.html',
  styleUrls: ['./discuss-home.component.scss']
})
export class DiscussHomeComponent implements OnInit {

  search = new FormControl();
  posteFileUrl = environment.profileImgUrl;
  notifications = [];

  poste: any;
  postes = [];
  load = false;
  comments = [];
  nbrSubscriptions;
  opened: boolean;
  isSignalPage: boolean = false;
  
 
  constructor(
    private discussS: DiscussService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
 
   this.getNotifications();
   this.search.valueChanges.subscribe(
     data => this.discussS.searchData.next(data)
   )
   
  }
  

  getNotifications() {
    this.discussS.getNotifications().subscribe(
      data => {
        this.notifications = data.notifications;
        this.nbrSubscriptions = data.nbrAbonn;
      }
    )
  }
  
  addNewPost() {
    const dialog = this.dialog.open(AddPosteComponent, {
      width: '600px',
      height: 'auto',
      disableClose: true
    });

    dialog.afterClosed().subscribe(result => {
      if(result.added){
        this.discussS.refrechData.next(true);
      }
    })

  }

  setRouter(path){
    this.router.navigateByUrl(path);
  }


  
  menuStatusChange(opened){
    this.opened = opened;
  }


  
 
  // setRouter(path){
  //   this.router.navigateByUrl(path);
  // }

}
