import { Component, OnInit } from '@angular/core';
import { CurrentPageService } from 'src/app/shared/services/current-page.service';
import { DiscussService } from 'src/app/shared/services/discuss.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-discuss-subscribers',
  templateUrl: './discuss-subscribers.component.html',
  styleUrls: ['./discuss-subscribers.component.scss']
})
export class DiscussSubscribersComponent implements OnInit {

  subscribersList: any;
  profileImgUrl = environment.profileImgUrl;
  
  constructor(
    private discussS: DiscussService,
    private currentPageS: CurrentPageService
  ) { }

  ngOnInit(): void {
    this.currentPageS.currentLink.next('disscution');
    this.getSubscribers();
  }

  getSubscribers(){
    this.discussS.getSubscribers().subscribe(
      data => { this.subscribersList = data.data }
    )
  }

}
