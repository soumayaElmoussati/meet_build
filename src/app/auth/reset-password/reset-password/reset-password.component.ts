import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { AuthService } from '../../services/auth.service';
export class ConfirmPasswordValidator {
  static MatchPassword(control: AbstractControl) {
    let password = control.get('new_password').value;
    let confirm_password = control.get('conf_password').value;

    if (password != confirm_password) {
      control.get('conf_password').setErrors({passwordnoConfirm: true});
    } else {
      return null;
    }
  }
}
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../../login/login.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class ResetPasswordComponent implements OnInit {
  show1=false
  show2=false
  passwordnoConfirm: boolean;
  responseMessage=null
  id: any;

  constructor(
    private authService : AuthService,private route:ActivatedRoute,private router: Router
  ) { }

  resetForm = new FormGroup({
  
    new_password: new FormControl('', {validators: [Validators.required,  Validators.compose([this.authService.patternValidator()])]}),
    conf_password: new FormControl('')
  }, {validators: ConfirmPasswordValidator.MatchPassword});

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  onSubmit() {
    if (this.resetForm.valid) {
  
      this.authService.reset(
      this.id, 
      {new_password: this.resetForm.get('conf_password').value}).subscribe(
        (data) => {
        
          if(data) this.router.navigate(['/login']);
          this.responseMessage='PASSWORD_UPDATED'
        //  setTimeout(() => {
        //   this.responseMessage=null
        //  }, 5000);
        },
        (error) => this.responseMessage=error.error.error,
      
      );
    }
    
  }
}
