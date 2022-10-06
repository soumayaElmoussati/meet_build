import { Component, OnInit } from '@angular/core';
import { CurrentPageService } from 'src/app/shared/services/current-page.service';
import { DiscussService } from 'src/app/shared/services/discuss.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-discuss-subscriptions',
  templateUrl: './discuss-subscriptions.component.html',
  styleUrls: ['./discuss-subscriptions.component.scss']
})
export class DiscussSubscriptionsComponent implements OnInit {

  subscriptionsList: any;
  profileImgUrl = environment.profileImgUrl;
  
  constructor(
    private discussS: DiscussService,
    private currentPageS: CurrentPageService,
    private profileS: ProfileService
  ) { }

  ngOnInit(): void {
    this.currentPageS.currentLink.next('disscution');
    this.getsubscriptions();
  }

  getsubscriptions(){
    this.discussS.getSubscriptions().subscribe(
      data => { this.subscriptionsList = data.data }
    )
  }


  likeProfile(id){ 
    this.profileS.like(id).subscribe(
      data => {
        this.getsubscriptions();
      },
      error => {},
      () => {}
    ) 
}

}
