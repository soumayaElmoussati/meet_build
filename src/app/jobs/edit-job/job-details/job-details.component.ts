import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ProjectService } from 'src/app/shared/services/project.service';
import { JobService } from 'src/app/shared/services/job.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {map, startWith} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { MapsAPILoader } from '@agm/core';
@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class JobDetailsComponent implements OnInit {
  jobForm = new FormGroup({
    id: new FormControl(),
    cp: new FormControl(),
    city: new FormControl(),
    address: new FormControl(),
    tel: new FormControl(),
    email_contact: new FormControl(),
    contract_type: new FormControl(),
    languageCtrl: new FormControl(),
    languages: new FormControl(),
    competences: new FormControl(),
  });
  jobCategoriesList: any;
  jobSubCategoriesList: any;
  competencesList: any; 
  languagesList: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  contractList :any = [];
  filteredLanguages: Observable<string[]>;
  selectedLanguage: any = [];

  @ViewChild('languageInput') languageInput: ElementRef;
  @ViewChild('project_address',{ static: false }) public job_address: ElementRef;

  constructor(
    private projectS: ProjectService,
    private jobS: JobService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<JobDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
  ) { }

  ngOnInit(): void {
    this.getLanguages();
    this.getContractTypes();
    this.jobForm.patchValue(this.data);
    this.selectedLanguage = this.data.languages;
  }

  onJobFormSubmit(){
    if( this.jobForm.valid ){
      this.jobForm.get('languages').setValue(this.selectedLanguage);
      let result;
      this.jobS.editDetails(this.jobForm.value).subscribe(
        response => {
          result = response;
          this.dialogRef.close(result.data); 
        },
        error => { },
        () => { }
      )
    }    
  }
  autoCompleteAddress(){
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.job_address.nativeElement, { componentRestrictions: { country: "be" } });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.jobForm.get('address').setValue(place.formatted_address);
          place.address_components.forEach(element => {
            if(element.types[0] == 'locality') this.jobForm.get('city').setValue(element.long_name);
            else if(element.types[0] == 'postal_code') this.jobForm.get('cp').setValue(element.long_name);
          });
        });
      });
    }, () => {  ; });
  } 

  getContractTypes(){
    let result;
    this.jobS.getContractTypes().subscribe(
      data => {
        result = data;
        this.contractList = result.data;
        let indexOfContractType = this.contractList.find(item => item.name == this.jobForm.get('contract_type').value.name);
        this.jobForm.get('contract_type').setValue(indexOfContractType);
      },
      error => {},
    )
  }

  getLanguages(){
    this.projectS.getLanguages().subscribe(
      data => { this.languagesList = data ; this.languagesList = this.languagesList.data},
      error => {},
      () => {
        this.filteredLanguages = this.jobForm.get('languageCtrl').valueChanges.pipe(
          startWith(null),
          map((language: string | null) => language ? this._filterLanguage(language) : this.languagesList.slice()));
      }
    )
  }
  private _filterLanguage(value: any): any[] {
    let name = value.name ? value.name : value;
    return this.languagesList.filter(language => language.name.toLowerCase().includes(name.toLowerCase()));
  }
  removeLanguage(skill, indx): void {
    this.selectedLanguage.splice(indx, 1);
  }
  selectedLang(event: MatAutocompleteSelectedEvent): void {
    this.selectedLanguage.push(event.option.value);
    this.languageInput.nativeElement.value = '';
    this.jobForm.get('languageCtrl').setValue(null);
  }
  close(){
    this.dialogRef.close();
  }
}
