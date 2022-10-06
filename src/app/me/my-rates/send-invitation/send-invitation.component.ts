import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-send-invitation',
  templateUrl: './send-invitation.component.html',
  styleUrls: ['./send-invitation.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class SendInvitationComponent implements OnInit {

  contactFormSubmitting = false;
  contactForm = new FormGroup({
    email: new FormControl('',[Validators.required , Validators.email]),
    email_type: new FormControl(1),
  }); 

  error: string  = null;

  constructor(
    private profileS: ProfileService,
    public dialogRef: MatDialogRef<SendInvitationComponent>,
  ) { }

  ngOnInit(): void {
    this.contactForm.get('email').valueChanges.subscribe( data => this.error = null )
  }

  onContactFormSubmit(){
    if(this.contactForm.valid){
      this.error = null;
      this.contactFormSubmitting = true;
      this.profileS.askForEvaluation(this.contactForm.get('email').value).subscribe(
        data => {
          if(data.error){
            this.error = data.error;
          }
          else{
          this.contactFormSubmitting = false;
          this.contactForm.reset();
          this.close();
          }
        },
        error => {  this.contactFormSubmitting = false; },
        () => { this.contactFormSubmitting = false }
      )
    }
  }

  close(){
    this.dialogRef.close();
  }


}
