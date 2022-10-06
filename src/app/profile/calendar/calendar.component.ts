import { Component, OnInit } from '@angular/core';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { AgendaService } from 'src/app/shared/services/agenda.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  
  profileSlug: any;
  profileId: any;
  agenda = [];
  profile: any;
  showAgenda = false;

  constructor(
    private route: ActivatedRoute,
    private profileS: ProfileService,
    private agendaS: AgendaService,
    private datePipe: DatePipe
  ) {
    this.route.paramMap.subscribe(params => {
      this.profileSlug = params.get('profile');
    });
  }

  ngOnInit(): void {
    this.getIdFromSlug();
  }

  
  getIdFromSlug(){
    let rdata;
    this.profileS.idFromSlug(this.profileSlug).subscribe(
      data => {
        rdata = data;
        this.profileId = rdata.id;
      },
      error =>{ console.log(error) },
      () => {
        this.getProfileInfo();
        this.getAgenda();
      }
    )
  }

  getProfileInfo(){
    this.profileS.about(this.profileId).subscribe(
      data => {
        this.profile = data.data;
      },
      error => {},
      () => {}
    )
  }


  getAgenda(){
    this.agendaS.getCalendarOfUser(this.profileId).subscribe(
      data => {
        this.agenda = data.data;
      },
      error =>{ console.log(error) },
      () => { this.showAgenda = true; }
    )
  }

  dateClass() {

    return (date: Date): MatCalendarCellCssClasses => {
      let customClass = null;
      let sDate, eDate, cDate, nDate;
      
      let firstDayInMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      let lastDayInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      let firstDay =  Date.parse(this.datePipe.transform(firstDayInMonth,"yyyy-MM-dd"));
      let lastDay =  Date.parse(this.datePipe.transform(lastDayInMonth,"yyyy-MM-dd"));
       
      this.agenda.forEach(element => {
        sDate = Date.parse(this.datePipe.transform(element.start_date.split('-')[2]+'-'+element.start_date.split('-')[1]+'-'+element.start_date.split('-')[0],"yyyy-MM-dd") );
        eDate = Date.parse(this.datePipe.transform(element.end_date.split('-')[2]+'-'+element.end_date.split('-')[1]+'-'+element.end_date.split('-')[0],"yyyy-MM-dd") );
        cDate = Date.parse(this.datePipe.transform(date,"yyyy-MM-dd"));
        //nDate = date;
        //console.log(nDate.setDate(nDate.getDate() + 1));
        if((cDate <= eDate && cDate >= sDate)) {
          customClass = element.status.name;
          if(cDate == sDate || date.getDay() == 0 || cDate == firstDay) { customClass += ' first_day';}
          if(cDate == eDate || date.getDay() == 6 || cDate == lastDay){customClass += ' last_day';}
           
          let sPipeDate = this.datePipe.transform(date,"yyyy-MM-dd");
          let nPipeDate = new Date(sPipeDate) ;
          nPipeDate.setDate(nPipeDate.getDate() + 1 );
          nDate = this.datePipe.transform(nPipeDate,"yyyy-MM-dd");
          this.agenda.forEach(elem => {
            let snDate = this.datePipe.transform(elem.start_date.split('-')[2]+'-'+elem.start_date.split('-')[1]+'-'+elem.start_date.split('-')[0],"yyyy-MM-dd") ;
            if( nDate == snDate ){
              customClass += ' last_day';
              
            }
          })
        }else{
          //customClass = 'UNSPECIFIED';
        }
        //console.log( this.datePipe.transform(date,"dd-MM-yyyy"), customClass);
      });

      return customClass;  
    };
  }

  selectDate($event) {
    
  }
 

}
