import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnChanges, OnInit, PLATFORM_ID, SimpleChange } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ConversationService } from '../shared/services/conversation.service';
import { CurrentPageService } from '../shared/services/current-page.service';

@Component({
  selector: 'app-postulations',
  templateUrl: './postulations.component.html',
  styleUrls: ['./postulations.component.scss']
})
export class PostulationsComponent implements OnInit {

  conversationsList: any;
  currentPage = 1;
  perPage = 8;
  state: string;
  stateParam = new BehaviorSubject<string>("");
  changeVar = this.stateParam.asObservable();
  stopCompteur: boolean = false;
  compteur = interval(4000);

  constructor(
    private conversationS: ConversationService,
    private route: ActivatedRoute,
    private currentPageS: CurrentPageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.route.paramMap.subscribe(params => {
      this.stateParam.next(params.get('state'));
      this.currentPageS.postulationCurrentLink.next(params.get('state'));
    });
  }

  ngOnInit(): void {
    this.getAllConversations();
    if (isPlatformBrowser(this.platformId)) {
      this.compteur
      .pipe(
        takeWhile(() => !this.stopCompteur)
      )
      .subscribe((n) => {
        this.getAllConversations(); 
      });
    }
    this.changeVar.subscribe( data => {
      this.state = data;
      this.getAllConversations();
    } );
  }

  ngOnDestroy(){
    this.stopCompteur = true;
  }

  getAllConversations(){
    if(this.state){
      this.conversationS.getMyConversations(this.perPage, this.state, this.currentPage).subscribe(
        data => { this.conversationsList = data.data }
      )  
    }
    
  } 

  favoriteStatusChange(index){
    if( this.state == 'favoris' && !this.conversationsList[index].favorite ){
      this.conversationsList.splice(index, 1);
    }
  }
  
  archiveStatusChange(index){
    if( this.state == 'archives' && !this.conversationsList[index].archived ){
      this.conversationsList.splice(index, 1);
    }
  }
}
