import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { ConversationService } from '../../services/conversation.service';
import { HelpersService } from '../../services/helpers.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {

  @Input() conversation;
  @Input() last;
  @Input() index;
  @Output() favoriteStatusChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() archiveStatusChange: EventEmitter<any> = new EventEmitter<any>();

  profileImgUrl = environment.profileImgUrl;
  constructor(
    private helpersS: HelpersService,
    private conversationS: ConversationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  favorite(id, index){
    this.conversationS.favoriteConversation(id).subscribe(
      data => { this.conversation.favorite = data.state },
      error => {},
      () => { this.favoriteStatusChange.emit(index) }
    )
  }

  archive(id, index){
    this.conversationS.archiveConversation(id).subscribe(
      data => { this.conversation.archived = data.state },
      error => {},
      () => { this.archiveStatusChange.emit(index) },
    )
  }

  navigateToConvercation(id){
    this.router.navigateByUrl('/mes-postulations/conversation/'+id);
  }

}
