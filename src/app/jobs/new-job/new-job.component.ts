import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/shared/services/project.service';
import { JobService } from 'src/app/shared/services/job.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { MY_FORMATS } from 'src/app/me/educations/educations.component';    
import { Observable } from 'rxjs';   
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {map, startWith} from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AdminService } from 'src/app/shared/services/admin.service';
@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class NewJobComponent implements OnInit {
  jobForm = new FormGroup({
    category: new FormControl('', Validators.required),
    subCategory: new FormControl('', Validators.required),
    function: new FormControl('', Validators.required ),
    description: new FormControl(),
    address: new FormControl(),
    city: new FormControl(),
    tel: new FormControl(),
    contractType: new FormControl(),
    emailContact: new FormControl(),
    languages: new FormControl(),
    competences: new FormControl(),
    skillCtrl: new FormControl(),
    languageCtrl: new FormControl(),
    hasPromoCode: new FormControl(false),
    codePromo: new FormControl()
  });

  prevUrl: string;
  jobCategoriesList: any;
  jobSubCategoriesList: any;
  competencesList: any; 
  languagesList: any;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredSkills: Observable<string[]>;
  selectedCompetences: any = [];

  filteredLanguages: Observable<string[]>;
  selectedLanguage: any = [];
  contractList :any = [];
  minDate = new Date();
  jobSlug: string;
  subscriptionId: string;
  paymentStatus: any;
  codePromo: string;
  jobId: string;

  showLoader: boolean = false;
  codePromoDetails = null;
  codePromoInvalid: boolean = false;
  submitingForm: boolean = false;

  @ViewChild('skillInput') skillInput: ElementRef;
  @ViewChild('languageInput') languageInput: ElementRef;
  @ViewChild('project_address',{ static: false }) public job_address: ElementRef;
  constructor(
    private projectS: ProjectService,
    private jobS: JobService,
    private router: Router,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private route: ActivatedRoute,
    private adminS: AdminService,
  ) {
    this.prevUrl = this.route.snapshot.queryParamMap.get('redirectTo');
    this.route.paramMap.subscribe( params => {
      this.subscriptionId =  params.get('subscription_id');
      this.jobSlug = params.get('slug');
      this.jobId = params.get('job_id');
      if(this.subscriptionId){
        this.checkPayment();
      }
    }
    )
  }

  ngOnInit(): void {
    this.getJobCategories();
    this.getCompetences();
    this.getLanguages();
    this.getContractTypes();
    this.jobForm.get('category').valueChanges.subscribe(
      data => this.getJobSubCategories()
    );
  }

  getJobCategories(){
    this.jobS.getCategories().subscribe(
      data => { this.jobCategoriesList = data; this.jobCategoriesList = this.jobCategoriesList.data }
    )
  }
  getJobSubCategories(){
    this.jobS.getSubCategories(this.jobForm.get('category').value.id).subscribe(
      data => { this.jobSubCategoriesList = data; this.jobSubCategoriesList = data.data; }
    )
  }
  getCompetences(){
    this.projectS.getCompetences().subscribe(
      data => { this.competencesList = data ; this.competencesList = this.competencesList.data},
      error => {},
      () => {
        this.filteredSkills = this.jobForm.get('skillCtrl').valueChanges.pipe(
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
        this.filteredLanguages = this.jobForm.get('languageCtrl').valueChanges.pipe(
          startWith(null),
          map((language: string | null) => language ? this._filterLanguage(language) : this.languagesList.slice()));
      }
    )
  }

  getContractTypes(){
    let result;
    this.jobS.getContractTypes().subscribe(
      data => {
        result = data;
        this.contractList = result.data;
      },
      error => {},
    )
  }

  private _filterSkill(value: any): any[] {
    let name = value.name ? value.name : value;
    return this.competencesList.filter(skill => skill.name.toLowerCase().includes(name.toLowerCase()));
  }
  private _filterLanguage(value: any): any[] {
    let name = value.name ? value.name : value;
    return this.languagesList.filter(language => language.name.toLowerCase().includes(name.toLowerCase()));
  }

  addSkill(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
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

    this.jobForm.get('skillCtrl').setValue(null);
  }


  addLanguage(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
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

    this.jobForm.get('languageCtrl').setValue(null);
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
    this.jobForm.get('skillCtrl').setValue(null);
  }
  selectedLang(event: MatAutocompleteSelectedEvent): void {
    this.selectedLanguage.push(event.option.value);
    this.languageInput.nativeElement.value = '';
    this.jobForm.get('languageCtrl').setValue(null);
  }

  onJobFormSubmit(){
    if( this.jobForm.valid ){
      this.submitingForm = true;
      this.jobForm.get('languages').setValue(this.selectedLanguage);
      //this.jobForm.get('competences').setValue(this.selectedCompetences);
      let result;
      this.jobS.addJob(this.jobForm.value).subscribe(
        data => {
          if( data.payment_link ){
            location.href = data.payment_link;
          }else{
            this.router.navigateByUrl('/jobs/'+data.slug);
          }
        },
        error => { },
        () => { this.submitingForm = false; }
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
          });
        });
      });
    }, () => {  ; });
  } 

  cancel(){
    this.router.navigateByUrl(this.prevUrl);
  }

  checkPayment(){
    let link: string;
    this.jobS.getPaymentStatus(this.subscriptionId).subscribe(
      data => {
        this.paymentStatus = data.status
      },
      error => {},
      () => {  }
    )
  }

  verifyCodePromo(){
    if(!this.jobForm.value.codePromo) return;
    this.showLoader = true;
    this.adminS.verifyCodePromo(this.jobForm.value.codePromo, 2).subscribe(
      data => {
        this.codePromoDetails = data;
        this.showLoader = false;
        if(!data.promoCode){
          this.codePromoInvalid = true;
          setTimeout(() => {
            this.codePromoInvalid = false; 
          }, 5000);
        }
      }
    )
  }

  payAd(){
    this.jobS.extendAd( this.jobId, null).subscribe(
      data => {
        location.href = data.payment_link;
      }
    )
  }


}
