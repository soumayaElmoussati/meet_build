import { Component, Input, OnInit } from '@angular/core';
import { ConversationService } from 'src/app/shared/services/conversation.service';

@Component({
  selector: 'app-my-projects-postulations',
  templateUrl: './my-projects-postulations.component.html',
  styleUrls: ['./my-projects-postulations.component.scss']
})
export class MyProjectsPostulationsComponent implements OnInit {

  @Input() activeLink;

  notificationsPostulation: number = 0;
  notificationsProjet: number = 0;

  constructor( private conversationS: ConversationService ) { }

  ngOnInit(): void {
    this.conversationS.changeNotifications.subscribe(
      data => {
        if(data){
          this.notificationsPostulation = parseInt(data.postulationNbr);
          this.notificationsProjet = parseInt(data.projectNbr);
        }
      }
    )

    
  }

}
