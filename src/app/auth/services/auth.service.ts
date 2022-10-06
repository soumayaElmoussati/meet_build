import { environment } from './../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from 'src/app/shared/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl;

  userRole = new BehaviorSubject(this.tokenS.getRole());
  newUserRole = this.userRole.asObservable();

  constructor(
    private http: HttpClient,
    private tokenS: TokenService
  ) { }

  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
      const valid = regex.test(control.value);
      return valid ? null : { invalidPassword: true };
    };
  }

  MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  userEmailValidator(userControl: AbstractControl) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.http.post<any>(this.apiUrl + 'verifyEmail', { email: userControl.value }).subscribe(
          data => {
            if (data) {
              resolve({ emailNotAvailable: true });
            }
            else {
              resolve(null);
            }
          },
          error => console.log(error)
        )
      }, 500);
    });
  }


  vatValidator(vatControl: AbstractControl) {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(vatControl.value);
        let vat = vatControl.value;
        if(vat){
          resolve(null);
          vat = vat.split('.').join('').split(',').join('').split(' ').join('').split(';').join('').split('-').join('');
          if( /^(?:\s*[0-9 ]\s*){9}$/.test(vat) || vat.length == 0 || vat == '' ){
            resolve(null);
          }
          else{
            console.log('vatNotValide');
            resolve({ vatNotValide: true });
          }
        }
        else{
          resolve(null);
        }
        
      }, 1000);
    });
  }


  verifyEmail(email):any{
    return this.http.post(this.apiUrl + 'verifyEmail', { email: email });
  }

  login(data) {
    return this.http.post<any>(this.apiUrl + 'login', data);
  }

  getPaymentStatus(id): any {
    return this.http.get(this.apiUrl + 'checkPayment/' + id);
  }

  authenticatedUser(): any {
    return this.http.get(this.apiUrl + '');
  }

  getPlan(plan_name) {
    return this.http.get<any>(this.apiUrl + 'payment-plan/' + plan_name);
  }

  sendRequest(data): any {
    return this.http.post<any>(this.apiUrl + 'forgotPassword', data);
  }

  reset(id, data): any {
    return this.http.post<any>(this.apiUrl + 'resetPassword/' + id, data);
  }

  getInformations(vat): any {
    return this.http.get<any>(this.apiUrl + 'getCompanyInfosFromVat/' + vat);
  }

  register(form) {
    return this.http.post<any>(this.apiUrl + 'register', form);
  }

  sendToken(token: string) {
    localStorage.setItem('LoggedInUser', token);
  }

  getSkillsUsingCodeNace(nace) {
    return this.http.get(this.apiUrl + 'getCompetencesUsingNace/' + nace);
  }




}
