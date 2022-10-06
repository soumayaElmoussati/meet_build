import { Component, OnInit } from '@angular/core';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@Component({
  selector: 'app-website-core',
  templateUrl: './website-core.component.html',
  styleUrls: ['./../website.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'website'
    }
  ]
})
export class WebsiteCoreComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
