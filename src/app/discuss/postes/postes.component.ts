import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BehaviorSubject, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ConfirmationComponent } from 'src/app/shared/dialogs/confirmation/confirmation.component';
import { CurrentPageService } from 'src/app/shared/services/current-page.service';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { environment } from 'src/environments/environment.prod';
import { DiscussService } from '../../shared/services/discuss.service';


@Component({
  selector: 'app-postes',
  templateUrl: './postes.component.html',
  styleUrls: ['./postes.component.scss']
})

export class PostesComponent implements OnInit {

  profileImgUrl = environment.profileImgUrl;
  posteFileUrl = environment.posteFileUrl;
  postes = [];
  comment = new FormControl('');
  response = new FormControl('');
  repoTo: null;
  perPage: number = 10;
  currentPage = 1;
  pagination = [];
  post_id: string = null;
  loadData:boolean = false;
  compteur = interval(4000);
  stopCompteur: boolean = false;
  newPosts: boolean = false;
  search: string;
  getPostProcessing:boolean = false;

  idParam = new BehaviorSubject<string>("");
  changeVar = this.idParam.asObservable();

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    dots: true,
    autoHeight: true,
    autoWidth: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      }
    }
  }
  
  constructor(
    private discussS: DiscussService,
    private helpersS: HelpersService,
    private route: ActivatedRoute,
    private router: Router,
    private profileS: ProfileService,
    private dialog: MatDialog,
    private currentPageS: CurrentPageService,
    @Inject(PLATFORM_ID) private platformId: Object
    ){
      this.route.paramMap.subscribe(
        params => this.idParam.next(params.get('id'))
      )
    }
  
  ngOnInit() {
    this.currentPageS.currentLink.next('disscution');
    this.discussS.signalePage.next(false);
    this.changeVar.subscribe( data => {
      if(data){
        this.post_id = data;
        this.postes = [];
        this.getPosts(null);
      }
    } );

    if(!this.post_id){
      if (isPlatformBrowser(this.platformId)) {
        this.compteur
        .pipe(
          takeWhile(() => !this.stopCompteur)
        )
        .subscribe((n) => {
          this.reload(); 
        });
      }
      this.discussS.changeVar.subscribe(
        data => {
          if(data){
            this.reload();
            this.discussS.refrechData.next(false);
          }
        }
      )  
    }
    
    this.discussS.changeSearchVar.subscribe(
      data => {
        if(!this.post_id){
          this.search = data;
          this.getPosts('SEARCH');  
        }
        
      }
    )
  }

  ngOnDestroy(){
    this.stopCompteur = true;
  }


  getPosts(val) {
    this.getPostProcessing = true;
    this.discussS.getPostes(this.perPage, this.currentPage, this.post_id, this.search).subscribe(
      data => {
        if(val == 'SEARCH'){
          this.postes = [];
          this.currentPage = 1;
        }
        data.data.forEach(element => {
          this.postes.push(element);
        });
        if(this.post_id) this.postes[0].showMessages = true;
        this.loadData = false;
      },
      error => {},
      () => { this.getPostProcessing = false; }
    )
  }

  like(index, poste_id){
    this.discussS.like( { post_id: poste_id } ).subscribe(
      data => { this.postes[index].ILikeIt = data.ILikeIt  }
    )
  }

  sendComment(index, poste_id){
    if(this.comment.value){
      const data = {
        post_id: poste_id,
        comment: this.comment.value
      }
      this.discussS.sendComment(data).subscribe(
        data => { 
          this.comment.setValue('');
          this.reload();
          this.postes[index].showMessages = true;
        }
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
        data => {
          this.response.setValue('');
          this.reload()
        }
      )
    }
  }
 
  onScrollDown() {
    if(this.post_id) return;
    this.loadData = true;
    this.currentPage++;
    this.getPosts(null);    
  }

  reload(){
    this.getPostProcessing = true;
    let data = [];
    this.postes.forEach(element => {
      data.push({
        post_id: element.id,
        nbr_comments: element.nbrComments
      })
    });
    this.discussS.loadData({posts: data}).subscribe(
      data => {
        let index;
        data.posts.forEach(element => {
          index = this.postes.findIndex(e => e.id === element.post_id );
          this.postes[index].nbrLikes = element.nbrLikes;
          if(element.comments){
            this.postes[index].comments = element.comments;
            this.postes[index].nbrComments = element.nbrComments;
          }
        });
        if(data.newPosts.length && this.search.length == 0 ){
          data.newPosts.forEach(element => {
            this.postes.unshift(element)
          });
          this.newPosts = true;
          setTimeout (() => {
            this.newPosts = false
          }, 6000);
        }
      },
      error => {},
      () => { this.getPostProcessing = false; }
    )
  }

  scrollToTop(){
    this.newPosts = false;
    window.scroll(0,0);
  }

  setRouter(path){
    this.router.navigateByUrl(path)
  }

  unFollowProfile(user_id, profile_id){
    const dialog = this.dialog.open( ConfirmationComponent , {
      data : {
        title: 'Lorem ipsum dolor sit, amet consectetur aut?',
        content: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit aut, consequuntur dolor consectetur ipsum voluptas. Odio architecto maxime aperiam accusamus.",
        confirmBtn: 'CONFIRMER',
        cancelBtn: 'CANCEL' 
      },
      width: '500px',
      height: 'auto',
      disableClose: true
    });
    dialog.afterClosed().subscribe(result => {
      if(result && result.confirm){
        this.profileS.like(profile_id).subscribe(
          data => {
            this.postes = this.postes.filter(elem => ( elem.user_id != user_id ));
          },
          error => {},
          () => {}
        ) 
      }
    })
  }
 

}

