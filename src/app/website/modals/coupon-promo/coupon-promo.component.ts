import { Component, OnInit } from '@angular/core';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { CouponCodeComponent } from 'src/app/shared/dialogs/coupon-code/coupon-code.component';

@Component({
  selector: 'app-coupon-promo',
  templateUrl: './coupon-promo.component.html',
  styleUrls: ['./coupon-promo.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'website'
    }
  ]
})
export class CouponPromoComponent implements OnInit {

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<CouponCodeComponent>,
  ) { }

  ngOnInit(): void {
  }

  goToRegister(){
    this.router.navigateByUrl('/register');
    this.dialogRef.close();
  }

}
