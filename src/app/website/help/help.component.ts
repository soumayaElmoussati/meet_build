import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./../website.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'website'
    }
  ]
})
export class HelpComponent implements OnInit {

  @ViewChild('mySection') mySection: ElementRef;
  jobBackgroundImageWidth;

  constructor( private router: Router ) { }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }


  ngAfterViewInit() {
    this.jobBackgroundImageWidth = (this.mySection.nativeElement.offsetWidth - ((this.mySection.nativeElement.offsetWidth - 1140) / 2));
    this.jobBackgroundImageWidth = this.jobBackgroundImageWidth+'px';
  }


}
