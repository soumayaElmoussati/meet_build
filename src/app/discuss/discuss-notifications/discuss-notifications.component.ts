import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscussService } from 'src/app/shared/services/discuss.service';
import { environment } from 'src/environments/environment.prod';
import { AddPosteComponent } from '../add-poste/add-poste.component';

@Component({
  selector: 'app-discuss-notifications',
  templateUrl: './discuss-notifications.component.html',
  styleUrls: ['./discuss-notifications.component.scss']
})
export class DiscussNotificationsComponent implements OnInit {

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

}
