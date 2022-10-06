import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor(
    private translocoS: TranslocoService
  ) { }

  formatDate(data): string{
    const date = data.split('-');
    return date[0] + ' ' + this.translocoS.translate('MONTH_'+date[1])  + ' ' + date[2];
  }

  /*
  
    "POSTED_SEEN" : "Déposé il y a {{time}} {{unite}}",
    "POSTED_LESS_THAN_A_MINUTE_AGO" : "Déposé il y a moins qu'une minute",
    "FILED_ON" : "Déposé le {{date}}",
  */
  
  postedAt(date): string{
    let period: string;
    switch(date.unite){
      case 'm' :
        if(date.value){
          period = this.translocoS.translate('POSTED_SEEN', { period: date.value, unite: (date.value==1) ?  this.translocoS.translate('MINUTE').toLowerCase() : this.translocoS.translate('MINUTES').toLowerCase() });
        }
        else{
          period = this.translocoS.translate('POSTED_LESS_THAN_A_MINUTE_AGO');
        }
        break;
      case 'h' :
        period = this.translocoS.translate('POSTED_SEEN', { period: date.value,  unite: (date.value==1) ? this.translocoS.translate('HOURE').toLowerCase() : this.translocoS.translate('HOURES').toLowerCase() });
        break;
      case 'd' :
        period = this.translocoS.translate('FILED_ON', { date: this.formatDate(date.value) });
        break;
    }
    return period;
  }

  sentSince(date): string{
    if(date.unite == "text"){
      return this.translocoS.translate(date.value.toUpperCase());
    }else{
      return date.value
    }
  }



}
