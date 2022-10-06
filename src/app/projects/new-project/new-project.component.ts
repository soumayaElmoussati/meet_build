import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ProjectService } from 'src/app/shared/services/project.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import { MapsAPILoader } from '@agm/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_FORMATS } from 'src/app/me/educations/educations.component';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class NewProjectComponent implements OnInit {

 
  
  projectForm = new FormGroup({
    category: new FormControl('', Validators.required),
    subCategory: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required ),
    description: new FormControl(),
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
    filesToAdd: new FormControl(),
    languages: new FormControl(),
    competences: new FormControl(),
  });
  projectCategoriesList: any;
  projectSubCategoriesList: any;
  competencesList: any; 
  languagesList: any;
  prevUrl: string;

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

  selectedFiles?: FileList;
  filesInfos: any[] = [];
  files: FileList;
  filePath = [];

  @ViewChild('skillInput') skillInput: ElementRef;
  @ViewChild('languageInput') languageInput: ElementRef;
  @ViewChild('project_address',{ static: false }) public project_address: ElementRef;
   
  
  constructor(
    private projectS: ProjectService,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.prevUrl = this.route.snapshot.queryParamMap.get('redirectTo');
  }

  ngOnInit(): void {
    this.getProjectCategories();
    this.getLanguages();
    this.projectForm.get('category').valueChanges.subscribe(
      data => {
        this.getProjectSubCategories();
        this.projectForm.get('subCategory').setValue('');
      }
    );
    this.projectForm.get('subCategory').valueChanges.subscribe(
      data => this.getCompetencesFromSubCategory()
    );
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

  getProjectCategories(){
    this.projectS.getCategories().subscribe(
      data => { this.projectCategoriesList = data; this.projectCategoriesList = this.projectCategoriesList.data }
    )
  }
  getProjectSubCategories(){
    this.projectS.getSubCategories(this.projectForm.get('category').value.id).subscribe(
      data => { this.projectSubCategoriesList = data; this.projectSubCategoriesList = data.data; },
      error => {},
      () => {
        if(this.projectSubCategoriesList.length){
          this.projectForm.get('subCategory').setValidators(Validators.required);
          this.projectForm.get('subCategory').updateValueAndValidity();
        }else{
          this.projectForm.get('subCategory').clearValidators();
          this.projectForm.get('subCategory').updateValueAndValidity();
        }
      }
    )
  }
  getCompetencesFromSubCategory(){
    this.projectS.getCompetencesFromSubCategory(this.projectForm.get('subCategory').value.id).subscribe(
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
      let files = this.filesInfos.filter(elem => ( elem.delete == false )); 
      this.projectForm.get('filesToAdd').setValue(files);
      this.projectForm.get('languages').setValue(this.selectedLanguage);
      this.projectForm.get('competences').setValue(this.selectedCompetences);
      let result;
      this.projectS.addProject(this.projectForm.value).subscribe(
        data => {
          result = data;
          this.router.navigateByUrl('/projets/'+result.slug);
        },
        error => { },
        () => { }
      )
    }    
  }

  
  addSkill(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our skill
    if ((value || '').trim()) {
      this.selectedCompetences.push({
        id:Math.random(),
        name:value.trim()
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.projectForm.get('skillCtrl').setValue(null);
  }


  addLanguage(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our skill
    if ((value || '').trim()) {
      this.selectedLanguage.push({
        id:Math.random(),
        name:value.trim()
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.projectForm.get('languageCtrl').setValue(null);
  }

  removeSkill(skill, indx): void {
    this.selectedCompetences.splice(indx, 1);
  }
  
  removeLanguage(skill, indx): void {
    this.selectedLanguage.splice(indx, 1);
  }

  selectedSkill(event: MatAutocompleteSelectedEvent): void {
    this.selectedCompetences.push(event.option.value);
    this.skillInput.nativeElement.value = '';
    this.projectForm.get('skillCtrl').setValue(null);
  }
  selectedLang(event: MatAutocompleteSelectedEvent): void {
    this.selectedLanguage.push(event.option.value);
    this.languageInput.nativeElement.value = '';
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

  
  onUploadFiles(event){
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      for (let i = 0 ; i < this.selectedFiles.length; i++) {
        this.upload(i + this.filePath.length, this.selectedFiles[i]);
        const reader = new FileReader();
        reader.onload = (e:any) => {
          this.filePath[this.filePath.length] = reader.result as string;
        }
        reader.readAsDataURL(this.selectedFiles[i]);
   
      }
    }
  }

  upload(idx, file){
    this.filesInfos[idx] = { progress: 0, fileName: file.name, newName: file.name, delete : false };
    if (file) {
      this.projectS.upload(file).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.filesInfos[idx].progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.filesInfos[idx].newName = event.body.fileName; 
          }
        },
        (err: any) => {
          this.filesInfos[idx].progress = 0;
          const msg = 'Could not upload the file: ' + file.name;
        });
    }
  }

  deleteFile(i){
    const data = { fileName: this.filesInfos[i].newName};
    this.projectS.deleteFiles(data).subscribe(
      data => { this.filesInfos[i].delete = true; },
      error => {},
      () => {}
    )

  }

  cancel(){
    this.router.navigateByUrl(this.prevUrl);
  }


}
