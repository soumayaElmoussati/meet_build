import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { TranslocoService, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { JobService } from 'src/app/shared/services/job.service';
import { MapsAPILoader } from '@agm/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { BehaviorSubject, interval } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { CurrentPageService } from 'src/app/shared/services/current-page.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-apply-for-job',
  templateUrl: './apply-for-job.component.html',
  styleUrls: ['./apply-for-job.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class ApplyForJobComponent implements OnInit {

  jobForm = new FormGroup({
    jobId: new FormControl(''),
    picture: new FormControl(null),
    picturePath: new FormControl(''),
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    tel: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    cv: new FormControl(null),
    cvPath: new FormControl(''),
    cover_letter: new FormControl(null),
    cover_letterPath: new FormControl(''),
    comment: new FormControl(''),
  })
  job = null;
  jobSlug: string = null;
  file: File[] = null;
  profileImgUrl = environment.profileImgUrl;
  messageText: string;
  jobFormSubmitting: boolean = false;


  @ViewChild('project_address', { static: false }) public job_address: ElementRef;
  constructor(
    private jobS: JobService,
    private router: Router,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private route: ActivatedRoute,
    private currentPageS: CurrentPageService,
    private snackBar: MatSnackBar,
    private translocoS: TranslocoService
    ) {
    this.route.paramMap.subscribe(params => {
      if (params.get('slug')) {
        this.jobSlug = params.get('slug');
      }
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
    this.currentPageS.currentLink.next('jobboard');
    this.getJob();
    this.translocoS.selectTranslate("APPLY_FOR_THE_JOB_SUCCESS").subscribe(
      data => this.messageText = data,
    )
  }

  getJob() {
    this.jobS.getJobDetail(this.jobSlug).subscribe(
      data => {
        this.job = data.data;
        this.jobForm.get('jobId').setValue(this.job.id);
      },
    )
  }

  onSubmit() {
    if (this.jobForm.valid) {
      this.jobFormSubmitting = true;
      this.jobS.apply(this.jobForm.value)
        .subscribe(
          (data) => {
            if(data.success){
              this.successMessage();
            }
          },
          (error) => { },
          () => {
            this.jobFormSubmitting = false;
            this.jobForm.reset();
          },
        );
    }
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
          this.jobForm.get('address').setValue(place.formatted_address);
        });
      });
    }, () => { ; });
  }

  onUploadFilesCL(event, type) {
    const reader = new FileReader();
    if (event.target.files) {
      reader.onload = (e: any) => {
        if (type == 'cv') {
          this.jobForm.get('cv').setValue(
            {
              base: reader.result as string,
              name: event.target.files[0].name
            }
          );
          this.jobForm.get('cvPath').setValue(event.target.files[0].name);
        }
        else if(type=='lm') {
          this.jobForm.get('cover_letter').setValue(
            {
              base: reader.result as string,
              name: event.target.files[0].name
            }
          )
          this.jobForm.get('cover_letterPath').setValue(event.target.files[0].name);
        }
        else {
          this.jobForm.get('picture').setValue(
            {
              base: reader.result as string,
              name: event.target.files[0].name
            }
          )
          this.jobForm.get('picturePath').setValue(event.target.files[0].name);
        }
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  setRouter(path){
    this.router.navigateByUrl(path);
  }


}


