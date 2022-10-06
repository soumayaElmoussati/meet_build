import { AfterViewInit, Component, ElementRef, NgZone, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { AuthService } from '../services/auth.service';
import { CountriesService } from '../../shared/services/countries.service';
import { CompetencesService } from '../../shared/services/competences.service';
import { MapsAPILoader } from '@agm/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from 'src/app/shared/services/token.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { map, startWith } from 'rxjs/operators';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class RegisterComponent implements OnInit {


  isLinear = true;

  show = false;
  loginForm: FormGroup;
  submitted: boolean;
  load = false;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  lookPass1: boolean;
  emailExist: boolean;

  etap_1 = 'active';
  etap_2 = '';
  etap_3 = '';
  etap_4 = '';

  plan = '';
  company_id = '';
  payment_plan = { price: null, id: null };
  payment_status = 'paid';
  company = { slug: null };

  lang = '';

  currentSkill = 0;

  

  regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  regexp_tel = new RegExp(/^(?:(?:\+|00)32|0)\s*[1-9](?:[\s.-]*\d{2}){4}/);
  regexp_tva = new RegExp(/^(?:\s*[0-9 ]\s*){9}$/);
  regexp_bic = new RegExp(/^(?:\s*[A-Z]\s*){8}$/);
  regexp_iban = new RegExp(/^BE(?:\s*[0-9 ]\s*){14}$/);

  accountConnected: boolean;
  payment_echec = false

  listCountries = [];
  listCompetences = [];

  defaultSkills = [];
  allSupSkills = [];
  supSkills: any;

  subscriptionId: string;
  paymentStatus = null;

  showLoader: boolean = false;
  codePromoDetails = null;
  codePromoInvalid: boolean = false;


  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  competenceCtrl = new FormControl();
  filteredCompetences: Observable<string[]>;
  competencesList: any = [

  ];
  allCompetences = [];

  vatNumberData:boolean = true;
  @ViewChild('competenceInput') competenceInput: ElementRef;

  @ViewChild('company_address', { static: false }) public company_address: ElementRef;
  @ViewChild('billing_address', { static: false }) public billing_address: ElementRef;

  checkForms = [];
  subscriptionType: string;

  constructor(
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private countriesService: CountriesService,
    private competencesService: CompetencesService,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private route: ActivatedRoute,
    private router: Router,
    private tokenS: TokenService,
    private adminS: AdminService,
    private profileS: ProfileService
  ) { 
    if(this.router.url === "/register/job"){
      this.subscriptionType = 'job';
    }else{
      this.subscriptionType = 'mission';
    }
    this.route.paramMap.subscribe(params => {
      this.subscriptionId = params.get('id');
      if(this.subscriptionId){
        this.etap_1 = 'checked';
        this.etap_2 = 'checked';
        this.etap_3 = 'checked';
        this.etap_4 = 'active';
        this.checkPayment();
      }
    });
  }

  ngOnInit(): void {
    this.getCompetences();
    this.firstFormGroup = this._formBuilder.group({
      firstname: ['', Validators.required,],
      lastname: ['', Validators.required],
      function: [''],
      email: ['', [Validators.required, Validators.pattern(this.regexp), Validators.email], this.authService.userEmailValidator.bind(this.authService)],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.secondFormGroup = this._formBuilder.group({
      company_name: ['', Validators.required],
      company_address: ['', Validators.required],
      latitude: [''],
      longitude: [''],
      contact_email: [''],
      tel: [''],
      website: [''],
      experience_years: [''],
      vat: ['', Validators.compose([Validators.required, Validators.pattern(this.regexp_tva)])],
      checkBilling: [true],
      billing_address: [''],
      billing_city: [''],
      billing_cp: [''],
      billing_country: [''],
      route: [''],
      locality: [''],
      country: [''],
      postal_code: [''],
      street_number: [''],
    });

    this.thirdFormGroup = this._formBuilder.group({
      defaultSkills: new FormControl(null),
      suppSkills: new FormControl(null),
      hasPromoCode: new FormControl(false),
      codePromo: new FormControl(''),
      accept_skill_condition: new FormControl(false),
    })

    this.secondFormGroup.get('vat').valueChanges.subscribe(
      data => {
        //this.secondFormGroup.get('vat').setValue(data.replace('.', ''));
      }
    )

    


    this.thirdFormGroup.get('suppSkills').valueChanges.subscribe(data => this.getSkillsUsingCodeNace())

    this.getAllCountries();
    //this.getAllCompetences();  

    /*
    google.maps.event.addDomListener(input, 'keydown', function(e) { 
      console.log('helloooo');
    });
    */
    
    this.checkForms = [
      { id: 1, submitted: false},
      { id: 2, submitted: false},
      { id: 3, submitted: false}
    ]

  }

  autoCompleteAddress() {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.company_address.nativeElement, { componentRestrictions: { country: "be" } });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.secondFormGroup.get('company_address').setValue(place.formatted_address);
          this.secondFormGroup.get('longitude').setValue(place.geometry.location.lng());
          this.secondFormGroup.get('latitude').setValue(place.geometry.location.lat());

          place.address_components.forEach(element => {
            if(element.types[0] == 'route') this.secondFormGroup.get('route').setValue(element.long_name);
            else if(element.types[0] == 'locality') this.secondFormGroup.get('locality').setValue(element.long_name);
            else if(element.types[0] == 'country') this.secondFormGroup.get('country').setValue(element.long_name);
            else if(element.types[0] == 'postal_code') this.secondFormGroup.get('postal_code').setValue(element.long_name);
            else if(element.types[0] == 'street_number') this.secondFormGroup.get('street_number').setValue(element.long_name);
          });


        });
      });
    }, () => { ; });
  }
  autoCompleteBillingAddress() {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.billing_address.nativeElement, { componentRestrictions: { country: "be" } });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.secondFormGroup.get('billing_address').setValue(place.formatted_address);
        });
      });
    }, () => { ; });
  }

  getAllCountries() {
    this.countriesService.getAllCountries().subscribe(
      data => { this.listCountries = data.data; }
    )
  }

  getAllCompetences() {
    /*
    this.competencesService.getAllCompetences().subscribe(
      data => { 
        this.listCompetences = data.data;
       }
    )
    */
  }

  getInfo(sync) {
    if(!this.secondFormGroup.value.vat) return;
    this.showLoader = true;
    this.authService.getInformations(this.secondFormGroup.get('vat').value).subscribe(
      data => {
        if (data.address) {
          if(sync){
            this.secondFormGroup.get('company_name').setValue(data.name);
            this.secondFormGroup.get('company_address').setValue(data.address);  
            this.secondFormGroup.get('latitude').setValue(data.latitude);  
            this.secondFormGroup.get('longitude').setValue(data.longitude);  
          }
        }else{
          this.vatNumberData = false;
          setTimeout(() => {
            this.vatNumberData = true;
          }, 5000);
        }
        this.defaultSkills = data.competences;
      },
      error => {
        this.showLoader = false;
      },
      () => {
        this.showLoader = false;
      }
    )
  }
  connectAccount() {

    let data = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      ...this.thirdFormGroup.value,
      defaultCompetences: this.defaultSkills,
      supCompetences: this.competencesList, //this.allSupSkills
      subscriptionType: this.subscriptionType
    }
    let result: any;
    this.authService.register(data).subscribe(
      data => {
        result = data;
        const con = {
          email: this.firstFormGroup.get('email').value,
          password: this.firstFormGroup.get('password').value,
        }
        this.authService.login(con).subscribe(
          data => {
            this.tokenS.set(data.access_token);
            if( result.payment_link ){
              location.href = result.payment_link;
            }else{
              this.router.navigateByUrl('/me');
            }
          }
        )
      },
      error => {},
      () => { 
        //location.href = link
      }
    )
  }

  firstFormSubmit() {
    if (this.firstFormGroup.valid) {
      this.checkForms[0].submitted = true;
      this.etap_1 = 'checked';
      this.etap_2 = 'active';
      this.etap_3 = '';
    }
  }

  

  secondeFormSubmit() {
    if (this.secondFormGroup.valid) {
      if(this.subscriptionType === 'job'){
        this.connectAccount();
      }else{
        this.checkForms[1].submitted = true;
      this.etap_1 = 'checked';
      this.etap_2 = 'checked';
      this.etap_3 = 'active';
      this.etap_4 = '';
      if(this.defaultSkills){
        this.getInfo(false)
      }
      }
    }
  }

  thirdFormSubmit() {
    if (this.thirdFormGroup.valid) {
      this.checkForms[2].submitted = true;
      this.etap_1 = 'checked';
      this.etap_2 = 'checked';
      this.etap_3 = 'checked';
      this.etap_4 = 'active';
    }
  }

  toFirstForm() {
    this.etap_1 = 'active';
    this.etap_2 = '';
    this.etap_3 = '';
    this.etap_3 = '';
  }

  toSecondeForm() {
    this.etap_1 = 'checked';
    this.etap_2 = 'active';
    this.etap_3 = '';
    this.etap_4 = '';
  }

  tothirdForm() {
    this.etap_1 = 'checked';
    this.etap_2 = 'checked';
    this.etap_3 = 'active';
    this.etap_4 = '';
  }

  tofourthForm() {
    this.etap_1 = 'checked';
    this.etap_2 = 'checked';
    this.etap_3 = 'checked';
    this.etap_4 = 'active';
  }

  


  onSubmit() {

  }

  getSkillsUsingCodeNace() {
    this.supSkills = null;
    let index = this.allSupSkills.findIndex(elem => elem.codeNace.code == this.thirdFormGroup.get('suppSkills').value);
    if (index >= 0) {
      this.supSkills = this.allSupSkills[index];
    }
    else {
      this.authService.getSkillsUsingCodeNace(this.thirdFormGroup.get('suppSkills').value).subscribe(
        data => {
          if (data) {
            this.allSupSkills.push(data);
            this.supSkills = data;
          }
        }
      )
    }
  }

  supSkillSelected():boolean{
    this.allSupSkills.forEach(element => {
      element.competences.forEach(elem => {
        if(elem.selected) return true;
      });
    });
    return false;
  }

  subscriptionOnJob(){
    
  }

  gotPayment() {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      this.authService.register(
        {
          redirectUrl: location.href,
          webhookUrl: location.href,
          payment_plan_id: this.payment_plan.id,
          ...this.firstFormGroup.value, ...this.secondFormGroup.value,
        }
      ).subscribe(
        data => {
          /*
          this.authService.sendToken(data.access_token);
          localStorage.setItem('language', data.language.code);
          localStorage.setItem('role', data.role );
          location.href = data.payment_link;
          */
        }
      );
    }
  }

  verifyCodePromo(){
    if(!this.thirdFormGroup.value.codePromo) return;
    this.showLoader = true;
    this.adminS.verifyCodePromo(this.thirdFormGroup.value.codePromo, 1).subscribe(
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

  reset() {
    this.loginForm.reset();
  }

  password() {
    this.show = !this.show;
  }

  checkPayment(){
    let link: string;
    this.authService.getPaymentStatus(this.subscriptionId).subscribe(
      data => {
        this.paymentStatus = data.status
      },
      error => {},
      () => {  }
    )
  }



  getCompetences(){
    let result;
    this.profileS.getAllCompetences().subscribe(
      data => { result = data },
      error => {},
      () => {
        this.allCompetences = result.data;
        this.filteredCompetences = this.competenceCtrl.valueChanges.pipe(
          startWith(null),
          map((competence: string | null) =>
          competence ? this._filter(competence) : this.allCompetences.slice()
          )
        );
      }
    )
  }

  add(event: MatChipInputEvent): void {
    //debugger;
    const input = event.input;
    const value = event.value;
    // Add our competence
    if ((value || '').trim()) {
      this.competencesList.push({
        id: Math.random(),
        name: value.trim()
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.competenceCtrl.setValue(null);
  }

  remove(competence, indx): void {
    this.competencesList.splice(indx, 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.competencesList.push(event.option.value);
    this.competenceInput.nativeElement.value = '';
    this.competenceCtrl.setValue(null);
  }

  private _filter(value: any): any[] { 
    if(value.length){
      return this.allCompetences.filter(competence =>
        competence.name.toLowerCase().includes(value.toLowerCase())
      );  
    }
    
  }

  goTo(n){
    console.log(n);
  }
 

}
