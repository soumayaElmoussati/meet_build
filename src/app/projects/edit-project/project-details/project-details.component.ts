import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ProjectService } from 'src/app/shared/services/project.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {map, startWith} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TranslocoService, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { MapsAPILoader } from '@agm/core';
import * as moment from 'moment';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class ProjectDetailsComponent implements OnInit {

  projectForm = new FormGroup({
    id: new FormControl(),
    cp: new FormControl(),
    city: new FormControl(),
    address: new FormControl(),
    distance: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
    latitude: new FormControl(),
    longitude: new FormControl(),
    skillCtrl: new FormControl(),
    languageCtrl: new FormControl(),
    languages: new FormControl(),
    competences: new FormControl(),
  });
  projectCategoriesList: any;
  projectSubCategoriesList: any;
  competencesList: any; 
  languagesList: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  //separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredSkills: Observable<string[]>;
  selectedCompetences: any = [];

  filteredLanguages: Observable<string[]>;
  selectedLanguage: any = [];

  minDate = new Date();

  distances = [
    { value: '5', name:'5km' },
    { value: '10', name:'10km' },
    { value: '15', name:'15km' },
    { value: '0', name: this.translocoS.translate('NO_MATTER')  }
  ]


  @ViewChild('skillInput') skillInput: ElementRef;
  @ViewChild('languageInput') languageInput: ElementRef;
  @ViewChild('project_address',{ static: false }) public project_address: ElementRef;
  
  constructor(
    private projectS: ProjectService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ProjectDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private translocoS: TranslocoService
  ) { }

  ngOnInit(): void {
    this.getCompetences();
    this.getLanguages();
    this.projectForm.patchValue(this.data);
    this.projectForm.get('startDate').setValue(new Date( this.data.startdate_en ));
    this.projectForm.get('endDate').setValue(new Date( this.data.enddate_en) );
    this.selectedLanguage = this.data.languages;
    this.selectedCompetences = this.data.competances;
  }

  autoCompleteAddress(){
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.project_address.nativeElement, { componentRestrictions: { country: "be" } });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.projectForm.get('address').setValue(place.formatted_address);
          this.projectForm.get('longitude').setValue(place.geometry.location.lng());
          this.projectForm.get('latitude').setValue(place.geometry.location.lat());

          place.address_components.forEach(element => {
            if(element.types[0] == 'locality') this.projectForm.get('city').setValue(element.long_name);
            else if(element.types[0] == 'postal_code') this.projectForm.get('cp').setValue(element.long_name);
          });
          
        });
      });
    }, () => {  ; });
  } 

  getCompetences(){
    this.projectS.getCompetencesFromSubCategory(this.data.sous_category.id).subscribe(
      data => { this.competencesList = data ; this.competencesList = this.competencesList.data},
      error => {},
      () => {
        this.filteredSkills = this.projectForm.get('skillCtrl').valueChanges.pipe(
          startWith(null),
          map((skill: string | null) => skill ? this._filterSkill(skill) : this.competencesList.slice()));
      }
    )
  } 

  getLanguages(){
    this.projectS.getLanguages().subscribe(
      data => { this.languagesList = data ; this.languagesList = this.languagesList.data},
      error => {},
      () => {
        this.filteredLanguages = this.projectForm.get('languageCtrl').valueChanges.pipe(
          startWith(null),
          map((language: string | null) => language ? this._filterLanguage(language) : this.languagesList.slice()));
      }
    )
  }

  onProjectFormSubmit(){
    if( this.projectForm.valid ){
      this.projectForm.get('languages').setValue(this.selectedLanguage);
      this.projectForm.get('competences').setValue(this.selectedCompetences);
      let result;
      this.projectS.editDetails(this.projectForm.value).subscribe(
        response => {
          result = response;
          this.dialogRef.close(result.data); 
        },
        error => { },
        () => { }
      )
    }    
  }

  removeSkill(skill, indx): void {
    this.selectedCompetences.splice(indx, 1);
  }
  
  removeLanguage(skill, indx): void {
    this.selectedLanguage.splice(indx, 1);
  }

  selectedSkill(event: MatAutocompleteSelectedEvent): void {
    this.selectedCompetences.push(event.option.value);
    //this.skillInput.nativeElement.value = '';
    this.projectForm.get('skillCtrl').setValue(null);
  }
  selectedLang(event: MatAutocompleteSelectedEvent): void {
    this.selectedLanguage.push(event.option.value);
    //this.languageInput.nativeElement.value = '';
    this.projectForm.get('languageCtrl').setValue(null);
  }

  private _filterSkill(value: any): any[] {
    let name = value.name ? value.name : value;
    return this.competencesList.filter(skill => skill.name.toLowerCase().includes(name.toLowerCase()));
  }
  private _filterLanguage(value: any): any[] {
    let name = value.name ? value.name : value;
    return this.languagesList.filter(language => language.name.toLowerCase().includes(name.toLowerCase()));
  }

  close(){
    this.dialogRef.close();
  }

}
