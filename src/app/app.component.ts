import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'meetandbuild-front';
  activeLang: string;
  availableLangs: string[] | {id: string, label: string}[]
  
  constructor(
    private service: TranslocoService,
  ){}

  ngOnInit(){
    this.activeLang = this.service.getActiveLang();
    this.availableLangs = this.service.getAvailableLangs();
  }

  changeLang(lang){
    this.service.setActiveLang(lang);
    this.activeLang = lang;
  }
}
