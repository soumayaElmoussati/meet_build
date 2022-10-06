import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import { DiscussService } from 'src/app/shared/services/discuss.service';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-poste',
  templateUrl: './poste.component.html',
  styleUrls: ['./poste.component.scss'],
  providers: [NgbCarousel, CarouselModule],
})
export class PosteComponent implements OnInit {

  profileImgUrl = environment.profileImgUrl;
  posteFileUrl = environment.posteFileUrl;
  @Input() poste;
  @Output() commentEvent = new EventEmitter<string>();
  comment = new FormControl('');
  response = new FormControl('');
  repoTo: null;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private helpersS: HelpersService,
    private discussS: DiscussService
  ) { }

  ngOnInit(): void {  
    
  }

  send() {
    this.commentEvent.emit(this.comment.value);
  }
  
  like(){
    this.discussS.like( { post_id: this.poste.id } ).subscribe(
      data => { }
    )
  }

  sendComment(){
    if(this.comment.value){
      const data = {
        post_id: this.poste.id,
        comment: this.comment.value
      }
      this.discussS.sendComment(data).subscribe(
        data => {}
      )
    }
  }
  sendCommentResponse(){
    if(this.response.value){
      const data = {
        comment_id: this.repoTo,
        comment: this.response.value
      }
      this.discussS.sendResponse(data).subscribe(
        data => {}
      )
    }
  }


}
