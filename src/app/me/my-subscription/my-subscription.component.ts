import { Component, OnInit } from '@angular/core';
import { CurrentPageService } from 'src/app/shared/services/current-page.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-my-subscription',
  templateUrl: './my-subscription.component.html',
  styleUrls: ['./my-subscription.component.scss']
})
export class MySubscriptionComponent implements OnInit {

  subscription: any;
  constructor(
    private profileS: ProfileService,
    private currentPageS: CurrentPageService
  ) { }

  ngOnInit(): void {
    this.currentPageS.meCurrentLink.next('abonnement');
    this.getMySubscriptiont();
  }

  getMySubscriptiont(){
    this.profileS.getMySubscription().subscribe(
      data => { this.subscription = data }
    )
  }

}
