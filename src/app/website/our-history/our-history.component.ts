import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@Component({
  selector: 'app-our-history',
  templateUrl: './our-history.component.html',
  styleUrls: ['./../website.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'website'
    }
  ]
})
export class OurHistoryComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

}
