import { Component, OnInit } from '@angular/core';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./../../website.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'website'
    }
  ]
})
export class PlansComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
