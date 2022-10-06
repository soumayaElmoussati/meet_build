import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { TranslocoService, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { interval } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';
import { CouponCodeComponent } from 'src/app/shared/dialogs/coupon-code/coupon-code.component';
import { CouponPromoComponent } from '../modals/coupon-promo/coupon-promo.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./../website.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'website'
    }
  ]
})
export class HomeComponent implements OnInit {

  @ViewChild('mySection') mySection: ElementRef;
  jobBackgroundImageWidth;

  job1: string = '';
  job2: string = '';
  jobArray = [ 'architectes', 'entrepreneurs', 'électriciens', 'maçons', 'plombiers', 'menuisiers', 'plafonneurs', 'peintres', 'chauffagistes', 'carreleurs', 'cuisinistes', 'ingénieurs' ];

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
  compteur = interval(200);
  compteurBack = interval(20);
  blinker = interval(200);
  pause = interval(1000);
  showType: boolean = false;
  Typing: boolean = true;
  endTyping1: boolean = false;
  endTyping2: boolean = false;
  endClear1: boolean = false;
  endClear2: boolean = false;
  cursor: string = '';
  random1: number = 0;
  random2: number = 0;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private title: Title,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {  }

  ngOnInit() {
    this.title.setTitle('Meet & build - Bight team, good work');
    this.meta.updateTag({property: 'og:title', content: 'Meet & build - Bight team, good work'});
    this.meta.updateTag({property: 'og:description', content: 'Meet & build - Bight team, good work'});
    
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    if (isPlatformBrowser(this.platformId)) {
      this.write();
    
    this.blinker.subscribe((n) => { 
      this.showType = !this.showType;
      if(this.showType) this.cursor = '|'; else this.cursor = '';
    })
    }
  }
  


  openModal(){
    const dialog = this.dialog.open(CouponPromoComponent, {
      width: '790px',
      height: 'auto',
      disableClose: false,
      panelClass: 'custom-dialog'
    });

    dialog.afterClosed().subscribe(result => {
      if (result && result.confirm) {
        
      }
    })
  }

  write() {

    if (isPlatformBrowser(this.platformId)) {
    this.compteur
      .pipe(
        takeWhile(() => this.Typing)
      )
      .subscribe((n) => {
        if(this.random1 == this.random2){
          this.random1 = Math.floor(Math.random() * this.jobArray.length);
          do{
            this.random2 = Math.floor(Math.random() * this.jobArray.length);
          }while(this.random1 == this.random2)
        }
        let currentJob1Length = this.job1.length;
        let currentJob2Length = this.job2.length;
        let currentIndexJob1Length = this.jobArray[this.random1].length;
        let currentIndexJob2Length = this.jobArray[this.random2].length;
        

        if (currentIndexJob1Length > currentJob1Length) {
          this.job1 = this.jobArray[this.random1].substring(0, currentJob1Length + 1);
        }else{
          this.endTyping1 =  true;
        }

        if (currentIndexJob2Length > currentJob2Length) {
          this.job2 = this.jobArray[this.random2].substring(0, currentJob2Length + 1);
        }
        else{
          this.endTyping2 = true;
        }
        if(this.endTyping1 && this.endTyping2){
          this.endTyping1 = false;
          this.endTyping2 = false;
          this.Typing = false;
          this.pause
            .pipe(
              take(1)
            )
            .subscribe((n) => {
              this.clear();
            });
        }
      });
    }
  }

  clear() {

    if (isPlatformBrowser(this.platformId)) {
    this.compteurBack
      .pipe(
        takeWhile(() => !this.Typing)
      )
      .subscribe((n) => {
        let currentJob1Length = this.job1.length;
        let currentJob2Length = this.job2.length;
        if (currentJob1Length) {
          this.job1 = this.jobArray[this.random1].substring(0, currentJob1Length - 1);
        }else{
          this.endClear1 = true;
        }
        if (currentJob2Length) {
          this.job2 = this.jobArray[this.random2].substring(0, currentJob2Length - 1);
        }else{
          this.endClear2 = true;
        }
        if(this.endClear1 && this.endClear2){
          this.endClear1 = false;
          this.endClear2 = false;
          this.Typing = true;
          this.random1 = 0;
          this.random2 = 0;
          this.write();
        }
      });
    }
  }

  ngAfterViewInit() {
    this.jobBackgroundImageWidth = (this.mySection.nativeElement.offsetWidth - ((this.mySection.nativeElement.offsetWidth - 1140) / 2));
    this.jobBackgroundImageWidth = this.jobBackgroundImageWidth + 'px';
    this.openModal();
  }

  scroll(el: HTMLElement){
    el.scrollIntoView();
  }





}
