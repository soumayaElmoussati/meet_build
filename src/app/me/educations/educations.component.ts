import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ProfileService } from 'src/app/shared/services/profile.service';

import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

import * as _moment from 'moment';
import * as moment from 'moment';
import { ConfirmationComponent } from 'src/app/shared/dialogs/confirmation/confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { TokenService } from 'src/app/shared/services/token.service';
import { CurrentPageService } from 'src/app/shared/services/current-page.service';
 

export const MY_FORMATS = {
  /*parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },*/
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-educations',
  templateUrl: './educations.component.html',
  styleUrls: ['./educations.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class EducationsComponent implements OnInit {

  profileSlug: string;
  profileId: string;
  profile = null;
  currentPage = 1;
  perPage = 12;
  formations: any;
  showForm = false;
  maxDate = new Date();
  addFirst = false;

  educationForm = new FormGroup({
    id: new FormControl(''),
    position: new FormControl(''),
    establishment: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
  }); 

  period_start = new FormControl(moment());
  period_end = new FormControl(moment());

  

  constructor(
    private profileS: ProfileService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private tokenS: TokenService,
    private currentPageS: CurrentPageService
  ) {
    this.profileId = this.tokenS.getId();
    this.profileSlug = this.tokenS.getSlug();
  }

  ngOnInit(): void {
    this.currentPageS.meCurrentLink.next('formation');
    this.getEducationalBackgrounds();
  }

  addFirstFormation(){
    this.showForm = true;
    this.addFirst = true;
  }

  getEducationalBackgrounds(){
    this.profileS.geteducationalBackgrounds(this.profileId).subscribe(
      data => { this.formations = data }
    )
  }

  onChangePosition(index, pos){
    let xpos = this.formations[index].position;
    let npos = this.formations[index+pos].position;
    this.formations[index].position = npos ;
    this.formations[index+pos].position = xpos ;
    this.sort(this.formations);
    this.updateListPosition();
  }

  sort(array){
    array.sort((a, b) => (a.position > b.position) ? 1 : -1)
  }

  updateListPosition(){
    let data =  [];
    this.formations.forEach(element => {
      data.push({
        id: element.id,
        position: element.position
      })
    });
    this.profileS.editPositionEducationalBackground({ educationalBackgrounds : data}).subscribe();
  }

  onEducationFormSubmit(){
    if( this.educationForm.valid ){
      const data = {
        id: this.educationForm.get('id').value,
        period_start: this.period_start.value,
        period_end: this.period_end.value,
        position: 0,
        establishment: this.educationForm.get('establishment').value,
        description: this.educationForm.get('description').value,
        location: this.educationForm.get('location').value,
      } ;
      let result;
      if(data.id){ // update
        this.profileS.updateEducationalBackground(data).subscribe(
          data => { 
            result = data;
            this.formations = result.data;
            this.resetForm();
          },
          error => {},
          () => {}
        )
      }
      else{ // add
        this.profileS.addEducationalBackground(data).subscribe(
          data => { 
            result = data;
            this.formations = result.data;
            this.resetForm();
          },
          error => {},
          () => {}
        )
      }
      

    }
  }

  onEditFormation(formation){
    this.showForm = true;
    this.educationForm.patchValue(formation);
    this.period_start.setValue( moment(formation.period_start) );
    this.period_end.setValue( moment(formation.period_end) );
  }

  onDeleteFormation(id){
    const dialog = this.dialog.open( ConfirmationComponent , {
      data : {
        title: 'ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_FORMATION',
        content: "THIS_FORMATION_WILL_BE_PERMANENTLY_DELETED_ARE_YOU_SURE_YOU_WANT_TO_DELETE_IT",
        confirmBtn: 'YES',
        cancelBtn: 'NO' 
      },
      width: '400px',
      height: 'auto',
      disableClose: true
    });

    dialog.afterClosed().subscribe(result => {
      if(result && result.confirm){
        this.deleteFormation(id);
      }
    })
  }

  deleteFormation(id){
    this.profileS.deleteEducationalBackground(id).subscribe(
      data => { this.getEducationalBackgrounds() },
      error => {},
      () => {}
    )
  }

  chosenYearHandlerStart(normalizedYear: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
    const ctrlValue = this.period_start.value;
    ctrlValue.year(normalizedYear.year());
    this.period_start.setValue(ctrlValue);
    datepicker.close();
  }

  chosenMonthHandlerStart(normalizedMonth: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
    const ctrlValue = this.period_start.value;
    ctrlValue.month(normalizedMonth.month());
    this.period_start.setValue(ctrlValue);
    datepicker.close();
  }
  chosenYearHandlerEnd(normalizedYear: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
    const ctrlValue = this.period_end.value;
    ctrlValue.year(normalizedYear.year());
    this.period_end.setValue(ctrlValue);
    datepicker.close();
  }

  chosenMonthHandlerEnd(normalizedMonth: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
    const ctrlValue = this.period_end.value;
    ctrlValue.month(normalizedMonth.month());
    this.period_end.setValue(ctrlValue);
    datepicker.close();
  }

  resetForm(){
    this.educationForm.reset();
    this.showForm = false;
  }

}
