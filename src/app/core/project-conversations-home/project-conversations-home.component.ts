import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ConversationService } from 'src/app/shared/services/conversation.service';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-project-conversations-home',
  templateUrl: './project-conversations-home.component.html',
  styleUrls: ['./project-conversations-home.component.scss']
})
export class ProjectConversationsHomeComponent implements OnInit {

  project = null;
  projectId: string;
  conversationsList = null;
  profileImgUrl = environment.profileImgUrl;
  selectedConversation: string = null;
  selectedConversationIndex: number = null;
  stopCompteur: boolean = false;
  compteur = interval(4000);

  constructor(
    private conversationS: ConversationService,
    private helpersS: HelpersService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id');
    });}

  ngOnInit(): void {
    this.getProjectConversations(); 
    if (isPlatformBrowser(this.platformId)) {
      this.compteur
      .pipe(
        takeWhile(() => !this.stopCompteur)
      )
      .subscribe((n) => {
        this.getProjectConversations(); 
      });
    }
    this.getProjectConversations(); 
    this.conversationS.changeVar.subscribe(
      data => {
        this.selectedConversation = data;
        this.compareIds();
      }
    )
  }

  ngOnDestroy(){
    this.stopCompteur = true;
    this.conversationS.conversationIdParam.next(null);
  }

  getProjectConversations(){
    this.conversationS.getProjectConversations(this.projectId).subscribe(
      data => { this.conversationsList = data.data },
      error => {},
      () => { this.compareIds() }
    )
  }

  onChangeProjectStatus(){

  }
  setRouter(path){
    this.router.navigateByUrl(path);
  }

  compareIds(){
    if(this.conversationsList && this.selectedConversation){
      const data = {
        id: this.selectedConversation,
        listIds: this.conversationsList.conversations.map(a => a.id)
      };
      this.conversationS.compareIds(data).subscribe(
        data => this.selectedConversationIndex = data.index
      )
    }
    
  }


  

}
