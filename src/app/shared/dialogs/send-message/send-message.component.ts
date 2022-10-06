import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class SendMessageComponent implements OnInit {

  emailForm = new FormGroup({
    id: new FormControl(''),
    subject: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required)
  })

  emailFormSubmitting: boolean = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SendMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private profileS: ProfileService
    ) {
      this.emailForm.get('id').setValue(this.data.profile_id)
    }

  ngOnInit(): void {
  }

  onCancel(){
    this.dialogRef.close();
  }

  emailFormSubmit(){
    if(this.emailForm.valid){
      this.emailFormSubmitting = true;
      this.profileS.sendMessage(this.emailForm.value).subscribe(
        data => {},
        error => {},
        () => { 
          this.emailFormSubmitting = false;
          this.dialogRef.close({
            confirm: true,
          });
        }
      )
    }
    
  }
  

}
