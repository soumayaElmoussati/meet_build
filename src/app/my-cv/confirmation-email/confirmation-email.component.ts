import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TokenService } from 'src/app/shared/services/token.service';

@Component({
  selector: 'app-confirmation-email',
  templateUrl: './confirmation-email.component.html',
  styleUrls: ['./confirmation-email.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class ConfirmationEmailComponent implements OnInit {

  regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  loginError=null;

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('', Validators.required)
  })

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ConfirmationEmailComponent>,
    private tokenService: TokenService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
      this.loginForm.controls['email'].setValue(data.email);
      this.loginForm.controls['password'].setValue(data.password);
    }

  ngOnInit(): void {}

  onCancel(){
    this.dialogRef.close();
  }

  onSubmit(){
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
        .subscribe(
          (data) => {
            this.tokenService.handletoken(data.access_token);
            this.tokenService.set(data.access_token);
          },
          (error)=>{
            this.loginError=error.error.error
          },
          () => {
            this.dialogRef.close({
              confirm: true,
            });
          },
          
        );
    }
    
  }

}
