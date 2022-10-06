import { Component, OnInit } from '@angular/core';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { AgendaService } from 'src/app/shared/services/agenda.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenService } from 'src/app/shared/services/token.service';
import { CurrentPageService } from 'src/app/shared/services/current-page.service';

 

@Component({
  selector: 'app-my-calendar',
  templateUrl: './my-calendar.component.html',
  styleUrls: ['./my-calendar.component.scss']
})
export class MyCalendarComponent implements OnInit {
  
  profileSlug: string;
  profileId: string;

  agenda = [];
  profile: any;
  calendarStatus: any;
  loadingAgenda = true;
  showAgencda = false;

  availablityForm = new FormGroup({
    startDate: new FormControl( Validators.required ),
    endDate: new FormControl( Validators.required ),
    status: new FormControl( Validators.required ),
  })
  
  constructor(
    private profileS: ProfileService,
    private agendaS: AgendaService,
    private datePipe: DatePipe,
    private tokenS: TokenService,
    private currentPageS: CurrentPageService
  ) {
    this.profileId = this.tokenS.getId();
    this.profileSlug = this.tokenS.getSlug();
  }

  ngOnInit(): void {
    this.currentPageS.meCurrentLink.next('agenda');
    this.loadingAgenda = false; 
    this.getIdFromSlug();
    this.getAgendaStatus();
  }

  getAgendaStatus(){
    let result: any;
    this.agendaS.getAgendaStatus().subscribe(
      data => { result = data },
      error => {},
      () => { this.calendarStatus = result.data }
    )
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
      data => { this.agenda = data.data; },
      error =>{ },
      () => { 
        this.showAgencda = true;
        this.loadingAgenda = true;
       }
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

  onAvailablityFormSubmit(){
    if(this.availablityForm.valid) {
      const data = {
        start_date: this.availablityForm.get('startDate').value,
        end_date: this.availablityForm.get('endDate').value,
        status_id: this.availablityForm.get('status').value.id,
      }
      this.agendaS.addAgenda(data).subscribe(
        data => { 
          this.ngOnInit() // to refrech calendar
        }
      )
    }
  }

 

}
