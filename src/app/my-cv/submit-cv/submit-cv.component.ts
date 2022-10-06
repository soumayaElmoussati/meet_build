import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslocoService, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { ProjectService } from 'src/app/shared/services/project.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { JobService } from 'src/app/shared/services/job.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { environment } from 'src/environments/environment.prod';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { ConfirmationComponent } from 'src/app/shared/dialogs/confirmation/confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { TokenService } from 'src/app/shared/services/token.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ConfirmationEmailComponent } from '../confirmation-email/confirmation-email.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-submit-cv',
  templateUrl: './submit-cv.component.html',
  styleUrls: ['./submit-cv.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class SubmitCvComponent implements OnInit {

  regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  profileImgUrl = environment.profileImgUrl;
  profileImagePath: any;
  profileImageProgress = 0;
  profileFormSubmitting: boolean = false;
 
  profileForm = new FormGroup({
    id: new FormControl(''),
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    birthday: new FormControl('', Validators.required),
    //email: new FormControl('', Validators.required, this.authService.userEmailValidator.bind(this.authService)),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    tel: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    route: new FormControl(''),
    street_number: new FormControl(''),
    locality: new FormControl(''),
    postal_code: new FormControl(''),
    country: new FormControl(''),
    category: new FormControl('', Validators.required),
    subCategory: new FormControl('', Validators.required),
    skills: new FormControl(''),
    experience_years: new FormControl('', Validators.required),
    cv: new FormControl(''),
    cvPath: new FormControl(''),
    active: new FormControl(false),
    condition: new FormControl(false, Validators.requiredTrue),
    connectedUserEmail: new FormControl(null),
    commentaire: new FormControl(''),
  })
  show: boolean = false;
  categoriesList = null;
  subCategoriesList = null
  skillsList = null;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  //separatorKeysCodes: number[] = [ENTER, COMMA];

  filteredSkills: Observable<string[]>;
  selectedSkills: any = [];

  formSubmitted: boolean = false;
  action: string = "modifier";
  editMode: boolean = false;
  myCV: any = [];
  publicCV: boolean;
  diff: any;
  fileName: string;
  connectedUserEmail: string = null;
  emailAvailable:boolean = true;
  messageText: string;

  @ViewChild('user_address', { static: false }) public job_address: ElementRef;
  @ViewChild('skillInput') skillInput: ElementRef;

  constructor(
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private projectS: ProjectService,
    private jobS: JobService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private profileS: ProfileService,
    private dialog: MatDialog,
    private tokenS: TokenService,
    private snackBar: MatSnackBar,
    private translocoS: TranslocoService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.route.paramMap.subscribe(params => {
      if (params.get('action')) this.action = params.get('action');
    });
  }

  successMessage(){
    this.snackBar.open(this.messageText, null, {
      duration: 6000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

  ngOnInit(): void {
    if (this.action == 'modifier') { // en cas de modification
      this.getMyCV();
      this.editMode = true;
    }
    else {
      if (isPlatformBrowser(this.platformId)) {
        if (this.tokenS.getToken()) {
          this.connectedUserEmail = this.tokenS.getEmail();
          this.profileForm.controls['connectedUserEmail'].setValue(this.connectedUserEmail);
          this.profileForm.controls['email'].setValidators(null);
          this.profileForm.controls['email'].updateValueAndValidity();
          this.profileForm.controls['password'].setValidators(null);
          this.profileForm.controls['password'].updateValueAndValidity();
        }
      }
      if (isPlatformServer(this.platformId)) {

      }
      this.getCategories();
      this.getSkills();
      this.profileForm.controls['email'].valueChanges.subscribe( data => this.verifyEmail() )
    }

    this.profileForm.controls['category'].valueChanges.subscribe( data => this.getSubCategories() );
    this.translocoS.selectTranslate("SUBMITTING_CV_SUCCESS").subscribe(
      data => this.messageText = data,
    )
  }

  verifyEmail(){ 
    if(this.profileForm.controls['email'].valid){
      setTimeout(() => {
        this.authService.verifyEmail(this.profileForm.value.email).subscribe(
          data => { this.emailAvailable = !data }
        )
      }, 500);
    } 
  }

  enterNewEmail(){
    this.connectedUserEmail = null;
    this.profileForm.controls['connectedUserEmail'].setValue(null);
    this.profileForm.controls['email'].setValidators([Validators.required, Validators.pattern(this.regexp)]);
    this.profileForm.controls['email'].updateValueAndValidity();
    this.profileForm.controls['email'].setValue('');
    this.profileForm.controls['password'].setValidators(Validators.required);
    this.profileForm.controls['password'].updateValueAndValidity();
    this.profileForm.controls['password'].setValue('');
  }

  getMyCV() {
    this.jobS.getCV().subscribe(
      data => {
        this.myCV = data.data;
        this.profileForm.get('id').setValue(this.myCV.id);
        this.profileForm.get('first_name').setValue(this.myCV.firstName);
        this.profileForm.get('last_name').setValue(this.myCV.lastName);
        this.profileForm.get('birthday').setValue(this.myCV.birthday);
        this.profileForm.get('tel').setValue(this.myCV.tel);
        this.profileForm.get('email').setValue(this.myCV.email);
        this.profileForm.get('category').setValue(this.myCV.category);
        this.profileForm.get('subCategory').setValue(this.myCV.subCategory);
        this.profileForm.get('address').setValue(this.myCV.address);
        this.profileForm.get('locality').setValue(this.myCV.city);
        this.profileForm.get('postal_code').setValue(this.myCV.cp);
        this.profileForm.get('cvPath').setValue(this.myCV.cv);
        this.profileForm.get('experience_years').setValue(this.myCV.experience_years);
        this.profileForm.get('condition').setValue(false);
        this.profileForm.get('active').setValue(this.myCV.active);
        this.publicCV = this.myCV.active;
        this.selectedSkills = this.myCV.competenceUser;
        this.fileName = this.myCV.cv;
        this.profileForm.controls['email'].setValidators(null);
        this.profileForm.controls['email'].updateValueAndValidity();
        this.profileForm.controls['password'].setValidators(null);
        this.profileForm.controls['password'].updateValueAndValidity();
      },
      error => { },
      () => {
        this.getCategories();
        this.getSkills();
      }
    )
  }

  getYears() {
    return moment(moment(), "DD/MM/YYYY").diff(moment(this.profileForm.value.birthday), 'years');
  }

  autoCompleteAddress() {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.job_address.nativeElement, { componentRestrictions: { country: "be" } });

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.profileForm.get('address').setValue(place.formatted_address);

          place.address_components.forEach(element => {
            if (element.types[0] == 'route') this.profileForm.get('route').setValue(element.long_name);
            else if (element.types[0] == 'locality') this.profileForm.get('locality').setValue(element.long_name);
            else if (element.types[0] == 'country') this.profileForm.get('country').setValue(element.long_name);
            else if (element.types[0] == 'postal_code') this.profileForm.get('postal_code').setValue(element.long_name);
            else if (element.types[0] == 'street_number') this.profileForm.get('street_number').setValue(element.long_name);
          });
        });
      });
    }, () => { });
  }

  getCategories() {
    this.jobS.getCategories().subscribe(
      data => { this.categoriesList = data.data },
      error => { },
      () => {
        let indexOfCategory = this.categoriesList.find(item => item.name == this.profileForm.get('category').value.name);
        this.profileForm.get('category').setValue(indexOfCategory);
        this.getSubCategories();
      }
    )
  }
  getSubCategories() {
    if(this.profileForm.get('category').value){
      this.jobS.getSubCategories(this.profileForm.get('category').value.id).subscribe(
        data => { this.subCategoriesList = data.data },
        error => { },
        () => {
          let indexOfCategory = this.subCategoriesList.find(item => item.name == this.profileForm.get('subCategory').value.name);
          this.profileForm.get('subCategory').setValue(indexOfCategory);
        }
      )  
    }
    
  }

  getSkills() {
    this.projectS.getCompetences().subscribe(
      data => { this.skillsList = data.data },
      error => { },
      () => {
        this.filteredSkills = this.profileForm.get('skills').valueChanges.pipe(
          startWith(null),
          map((skill: string | null) => skill ? this._filterSkill(skill) : this.skillsList.slice()));
      }
    )
  }

  addSkill(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our skill
    if ((value || '').trim()) {
      this.selectedSkills.push({
        id: Math.random(),
        name: value.trim()
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.profileForm.get('skills').setValue(null);
  }
  removeSkill(skill, indx): void {
    this.selectedSkills.splice(indx, 1);
  }
  selectedSkill(event: MatAutocompleteSelectedEvent): void {
    this.selectedSkills.push(event.option.value);
    this.skillInput.nativeElement.value = '';
    this.profileForm.get('skills').setValue(null);
  }
  private _filterSkill(value: any): any[] {
    let name = value.name ? value.name : value;
    return this.skillsList.filter(skill => skill.name.toLowerCase().includes(name.toLowerCase()));
  }

  onUploadFiles(event) {
    const reader = new FileReader();
    if (event.target.files) {
      reader.onload = (e: any) => {
        this.profileForm.get('cv').setValue(
          {
            base: reader.result as string,
            name: event.target.files[0].name
          }
        );
        this.profileForm.get('cvPath').setValue(event.target.files[0].name);
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    this.profileForm.get('skills').setValue(this.selectedSkills);
    if (this.profileForm.valid) {
      this.profileFormSubmitting = true;
      if (this.profileForm.value.id) {
        this.jobS.editCV(this.profileForm.value).subscribe(
          (data) => {
            if (data.success) {
              this.successMessage();
            }
          },
          (error) => { },
          () => {
            this.getMyCV();
            this.profileFormSubmitting = false;
          },
        )
      } else {
        if(!this.connectedUserEmail && !this.emailAvailable){
          const dialog = this.dialog.open(ConfirmationEmailComponent, {
            data: this.profileForm.value,
            width: '400px',
            height: 'auto',
            disableClose: true
          });
      
          dialog.afterClosed().subscribe(result => {
            if (result && result.confirm) {
              this.connectedUserEmail = this.profileForm.value.email;
              this.profileForm.controls['connectedUserEmail'].setValue(this.connectedUserEmail);
              this.putCV();
            }
          })
        }else{
          this.putCV();
        }
      }
    }
  }

  putCV(){
    this.jobS.putCV(this.profileForm.value).subscribe(
      (data) => {
        if (data.success) {
          this.successMessage();
        }
      },
      (error) => { },
      () => {
        this.profileForm.reset();
        this.profileFormSubmitting = false;
        this.selectedSkills = [];
      },
    )
  }

  downloadCV() {
    this.jobS.downloadCV(this.myCV.cv_path).subscribe(
      data => {
        let file = new Blob([<any>data], { type: 'application/pdf' });
        let url = window.URL.createObjectURL(file);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = this.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    )
  }


  onDeleteProfilePicture() {
    const dialog = this.dialog.open(ConfirmationComponent, {
      data: {
        title: 'ARE_YOU_SURE_YOU_WANT_TO_DELETE_YOUR_PROFILE_PICTURE',
        content: "",
        confirmBtn: 'YES',
        cancelBtn: 'NO'
      },
      width: '400px',
      height: 'auto',
      disableClose: true
    });

    dialog.afterClosed().subscribe(result => {
      if (result && result.confirm) {
        this.profileS.deleteProfilePicture().subscribe(
          data => { },
          error => { },
          () => {
            this.profileS.profilePicture.next('no-picture.jpg');
            this.profileImagePath = this.profileImgUrl + "no-picture.jpg";
          }
        );
      }
    })
  }

  onEditProfilePicture(event) {
    let file = event.target.files[0];
    if (file) {
      this.uploadProfilePicture(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImagePath = reader.result as string;
      }
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture(file) {
    this.profileImageProgress = 0;
    if (file) {
      this.profileS.updateCVPicture(file).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.profileImageProgress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.profileS.profilePicture.next(event.body.imageName);
          }
        },
        (err: any) => {
          this.profileImageProgress = 0;
          console.log('Could not upload the file: ' + file.name);
        },
        () => {

        }
      );

    }

  }


}
