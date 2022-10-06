import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ConversationService } from 'src/app/shared/services/conversation.service';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import { environment } from 'src/environments/environment.prod';

export interface filePath {
  base: string;
  name: string;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit {

  projectID: string;
  conversation = {
    conversation_id: null,
    messages: null,
    project: null,
    status: null,
    isAssignedToMe: null,
  };
  profileImgUrl = environment.profileImgUrl;
  lastMessage = 0;
  
  selectedFiles?: FileList;
  conversationfiles = [];

  sendForm = new FormGroup({
    messageFiles: new FormControl(''),
    message: new FormControl('', Validators.required),
    projectId: new FormControl(''),
  })
  compteur = interval(4000);
  stopCompteur = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private conversationS: ConversationService,
    private helpersS: HelpersService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.route.paramMap.subscribe(params => {
      this.projectID = params.get('id');
      this.sendForm.get('projectId').setValue(this.projectID);
    });
  }

  ngOnInit(): void {
    this.getConversation();

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

  getConversation() {
    const data = {
      projectId: this.projectID,
      lastMessage: this.lastMessage
    }
    this.conversationS.getConversation(data).subscribe(
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
        if(this.conversation.conversation_id){
          this.lastMessage = this.conversation.messages[this.conversation.messages.length-1].id;
        }
      }
    )
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
      this.conversationS.sendMessage(this.sendForm.value).subscribe(
        data => { this.getConversation() },
        error => {},
        () => {
          this.sendForm.get('message').setValue('');
          this.sendForm.get('messageFiles').setValue('');
          this.conversationfiles = [];
        }
      )
      
    }
  }

  isAssignedToMe():boolean{
    if(this.conversation.project && this.conversation.project.status.name =='ASSIGNED' && this.conversation.isAssignedToMe) return true;
    return false;
  }

  isNotAssignedToMe():boolean{
    if(this.conversation.project && this.conversation.project.status.name =='ASSIGNED' && !this.conversation.isAssignedToMe) return true;
    return false;
  }

  disableForm():boolean{
    if(this.conversation.project && this.conversation.project.status.name =='ASSIGNED' && !this.conversation.isAssignedToMe) return true;
    return false;
  }
 
  setRouter(path) {
    this.router.navigateByUrl(path);
  }

}
