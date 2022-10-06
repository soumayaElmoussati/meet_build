import { TokenService } from './../../shared/services/token.service';
import { AuthService } from './../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class LoginComponent implements OnInit {
 
  loginForm = new FormGroup({
    email: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')]}),
    password: new FormControl('', Validators.required),
    remember_me: new FormControl(false),
  }); 
  loginError=null;
  prevUrl: any = null;

  constructor(
    public http: HttpClient,
    private authService : AuthService,
    private tokenService: TokenService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.prevUrl = this.route.snapshot.queryParamMap.get('redirectTo');
  }

  ngOnInit(): void {
  }

  onSubmit() {
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
            if(this.prevUrl){
              this.router.navigateByUrl(this.prevUrl);
            }else if(this.tokenService.getRole()?.includes("mission")){
              this.router.navigateByUrl('projets');
            }else if(this.tokenService.getRole()?.includes("job")){
              this.router.navigateByUrl('me');
            }else if(this.tokenService.getRole()?.includes("cv")){
              this.router.navigateByUrl('cv');
            }else if(this.tokenService.getRole()?.includes("admin")){
              this.router.navigateByUrl('admin');
            }
          
          },
          
        );
    }
  }
 
}
