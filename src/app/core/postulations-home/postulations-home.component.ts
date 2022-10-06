import { Component, OnInit } from '@angular/core';
import { CurrentPageService } from 'src/app/shared/services/current-page.service';

@Component({
  selector: 'app-postulations-home',
  templateUrl: './postulations-home.component.html',
  styleUrls: ['./postulations-home.component.scss']
})
export class PostulationsHomeComponent implements OnInit {

  opened: boolean;
  phoneMenu: boolean = false;
  activeLink = 'postulations';
  currentLink: string;
  
  constructor(
    private currentPageS: CurrentPageService
  ) { }

  ngOnInit(): void {
    this.currentPageS.currentLink.next('');
    this.currentPageS.newPostulationCurrentLink.subscribe(
      data => this.currentLink = data
    )
  }

  menuStatusChange(opened){
    this.opened = opened;
  }

  phoneMenuStatus(opened){
    this.phoneMenu = opened;
  }


}
