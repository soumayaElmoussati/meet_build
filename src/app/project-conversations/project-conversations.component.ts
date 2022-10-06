import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, interval } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { ConfirmationComponent } from '../shared/dialogs/confirmation/confirmation.component';
import { ConversationService } from '../shared/services/conversation.service';
import { ProjectService } from '../shared/services/project.service';
import { AssignModelComponent } from './assign-model/assign-model.component';

@Component({
  selector: 'app-project-conversations',
  templateUrl: './project-conversations.component.html',
  styleUrls: ['./project-conversations.component.scss']
})
export class ProjectConversationsComponent implements OnInit {


  conversation = {
    conversation_id: null,
    messages: null,
    project: null,
    sender: null,
    status: null,
    pinned: null,
  };
  profileImgUrl = environment.profileImgUrl;
  lastMessage = 0;
  
  selectedFiles?: FileList;
  conversationfiles = [];

  sendForm = new FormGroup({
    messageFiles: new FormControl(''),
    message: new FormControl('', Validators.required),
    conversationId: new FormControl(''),
  })
  
  conversationId: string = null;

  compteur = interval(4000);
  stopCompteur = false;

  constructor(
    private route: ActivatedRoute,
    private conversationS: ConversationService,
    private projectS: ProjectService,
    private router: Router,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.route.paramMap.subscribe(params => {
      if(params.get('conversation')){
        this.conversationS.conversationIdParam.next(params.get('conversation'));
      }
    });
  }

  ngOnInit(): void {
    this.conversationS.changeVar.subscribe( data => {
      this.conversationId = data;
      this.sendForm.get('conversationId').setValue(this.conversationId);
      this.conversation = {
        conversation_id: null,
        messages: null,
        project: null,
        sender: null,
        status: null,
        pinned: null,
      };
      this.lastMessage = 0;
      this.getConversation();
    } );

    if (isPlatformBrowser(this.platformId)) {
      this.compteur
      .pipe(
        takeWhile(() => !this.stopCompteur)
      )
      .subscribe((n) => {
        this.getConversation(); 
      });
    }
  }

  ngOnDestroy(){
    this.stopCompteur = true;
  }

  getConversation(){
    if(this.conversationId){
      this.conversationS.getConversationByConversationId(this.conversationId, this.lastMessage).subscribe(
        data => { 
          if(data){
            if(this.conversation.conversation_id ){
              if(data.data.messages.length){
                data.data.messages.forEach(element => {
                  this.conversation.messages.push(element);
                });
              }
              this.conversation.status = data.data.status;
              
            }
            else{
              this.conversation = data.data;
            }
          }
        },
        error => {},
        () => {
          if(this.conversation.messages){
            this.lastMessage = this.conversation.messages[this.conversation.messages.length-1].id;
          }
        }
      )
    }
  }


  onUploadFiles(event){
    this.selectedFiles = event.target.files;
    if (this.selectedFiles) {
      for (let i = 0 ; i < this.selectedFiles.length; i++) {
        const reader = new FileReader();
        reader.onload = (e:any) => {
          this.conversationfiles.push(
            {
              base : reader.result as string,
              name : this.selectedFiles[i].name
            }
          )
        }
        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  deleteFile(i){
    this.conversationfiles.splice(i, 1);
  }

  downloadFile(fileName, filePath){
    this.conversationS.downloadFile(filePath).subscribe(
      data => {
        let file = new Blob([<any>data], { type: 'application/pdf' });
        let url = window.URL.createObjectURL(file);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    )
  }

  onSendFormSubmit() {
    this.sendForm.get('messageFiles').setValue(this.conversationfiles);
    if (this.sendForm.valid) {
      this.conversationS.newMessage(this.sendForm.value).subscribe(
        data => {},
        error => {},
        () => {
          this.getConversation();
          this.sendForm.get('message').setValue('');
          this.sendForm.get('messageFiles').setValue('');
          this.conversationfiles = [];
        }
      )
      
    }
  }

  onDeleteConversation(id){
    const dialog = this.dialog.open( ConfirmationComponent , {
      data : {
        title: 'ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_COVERSATION',
        content: "THIS_CONVERSATION_WILL_BE_PERMANENTLY_DELETED_ARE_YOU_SURE_YOU_WANT_TO_DELETE_IT",
        confirmBtn: 'YES',
        cancelBtn: 'NO' 
      },
      width: '400px',
      height: 'auto',
      disableClose: true
    });
    dialog.afterClosed().subscribe(result => {
      if(result && result.confirm){
        this.conversationS.deleteConversation(this.conversation.conversation_id).subscribe(
          data => {
            this.conversation = {
              conversation_id: null,
              messages: null,
              project: null,
              sender: null,
              status: null,
              pinned: null,
            };
          }
        )
      }
    })
  }

  onPinConversation(){
    this.conversationS.pinConversation(this.conversation.conversation_id).subscribe(
      data => {  },
      error => {},
      () => { this.conversation.pinned = !this.conversation.pinned }
    )
  }

  onAssignProject(){
    const dialog = this.dialog.open( AssignModelComponent , {
      data : this.conversation.sender,
      width: '600px',
      height: 'auto',
      disableClose: true
    });
    dialog.afterClosed().subscribe(result => {
      if(result && result.confirm){
        this.AssignProject();
      }
    })
  }

  AssignProject(){
    this.projectS.assignProject( this.conversation.project.id ,this.conversation.sender.id).subscribe(
      data => { this.conversation.project = data.data }
    )
  }

  setRouter(path){
    this.router.navigateByUrl(path);
  }

}
