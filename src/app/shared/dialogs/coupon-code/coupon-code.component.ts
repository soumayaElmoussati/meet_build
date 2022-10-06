import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-coupon-code',
  templateUrl: './coupon-code.component.html',
  styleUrls: ['./coupon-code.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'fields'
    }
  ]
})
export class CouponCodeComponent implements OnInit {

  codePromoGroup =new FormGroup({
    hasPromoCode: new FormControl(false),
    codePromo: new FormControl(''),
  })
  showLoader: boolean = false;
  codePromoDetails = null;
  codePromoInvalid: boolean = false;

  constructor(
    public adminS: AdminService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CouponCodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

  ngOnInit(): void {}

  onCancel(){
    this.dialogRef.close();
  }

  onConfirm(){
    this.dialogRef.close({
      confirm: true,
      data: this.codePromoGroup.value
    });
  }

  verifyCodePromo(){
    if(!this.codePromoGroup.value.codePromo) return;
    this.showLoader = true;
    this.adminS.verifyCodePromo(this.codePromoGroup.value.codePromo, 1).subscribe(
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
  

}
