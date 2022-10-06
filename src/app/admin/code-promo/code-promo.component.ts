import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslocoService, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ConfirmationComponent } from 'src/app/shared/dialogs/confirmation/confirmation.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import * as moment from 'moment';

@Component({
  selector: 'app-code-promo',
  templateUrl: './code-promo.component.html',
  styleUrls: ['./../admin.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'admin'
    }
  ]
})
export class CodePromoComponent implements OnInit {

  currentPage: number = 1;
  pagination = [];
  perPage: number = 9;
  search = new FormControl('');
  order = new FormControl('ALPHABETICAL');
  codePromoList: any;
  displayedColumns: string[] = ['code', 'number', 'date', 'period', 'for', 'status', 'action'];
  codePromoDataSource = new MatTableDataSource(<any>[]);
  SubscriptionsTypeList: [];

  formSubmiting: boolean = false;

  numbers = [
    { value: '1', name: '1 mois' },
    { value: '2', name: '2 mois' },
    { value: '3', name: '3 mois' },
    { value: '6', name: '6 mois' },
    { value: '12', name: '1 an' },
    { value: '0', name: 'A vie' },
  ]
  selectedSubscriptions = [];
  promoCodeForm = new FormGroup({
    id: new FormControl(),
    start_date: new FormControl(moment(), Validators.required ),
    end_date: new FormControl( moment(), Validators.required ),
    gratuity_duration: new FormControl( Validators.required ),
    maximum: new FormControl(0, Validators.required ),
    promo_code: new FormControl( Validators.required ),
    subscription_types: new FormControl( Validators.required ),
  })
  constructor(
    private translocoS: TranslocoService,
    private adminS: AdminService,
    private dialog: MatDialog
  ) {
    this.translocoS.selectTranslate('PROMO_CODE', null, 'admin').subscribe(value => this.adminS.dataTitle.next(value));
    this.adminS.dataSubTitle.next(null);
    this.adminS.dataBackTo.next('/admin');
    this.adminS.currentLinkParam.next({ parent:6, child:0 });}

  ngOnInit(): void {
    this.getAllPromoCodes();
    this.getSubscriptionsType();
    this.order.valueChanges.subscribe( data => { this.getAllPromoCodes() } );
    this.search.valueChanges.subscribe( data => { this.getAllPromoCodes() } );
    this.getCode();
  }

  getCode() {
    var chars = "0123456789~!@#$%^&*()_+}{[]|abcdefghikjlmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var pass = "";
    var passLength = 16;

    for (var i = 0; i < passLength; i++) {
        var randPass = Math.floor(Math.random() * chars.length);
        pass += chars.substring(randPass, randPass+1);
    }
    this.promoCodeForm.get('promo_code').setValue(pass);
  }

  getSubscriptionsType(){
    this.adminS.getSubscriptions().subscribe(
      data => {
        this.SubscriptionsTypeList = data.data;
        console.log(this.SubscriptionsTypeList);
      }
    )
  }

  onSubscriptionsChange(subscription, event){
    if(event.checked){
      this.selectedSubscriptions.push(subscription);
    }else{
      let index = this.selectedSubscriptions.findIndex(el => el.type == subscription.type);
      this.selectedSubscriptions.splice(index, 1);
    }
  }

  isSubscriptionChecked(subscription): boolean{
    let index = this.selectedSubscriptions.findIndex(el => el.type == subscription.type);
    if(index < 0) return false;
    else return true;
  }

  getAllPromoCodes(){
    const data = {
      lenght: this.perPage,
      page: this.currentPage,
      search: this.search.value,
      order: this.order.value,
    }
    this.adminS.getAllPromoCodes(data).subscribe(
      data => { 
        this.codePromoList = data;
        this.refrechDataSource();
      }
    )
  }
  refrechDataSource(){
    this.codePromoDataSource = new MatTableDataSource(this.codePromoList.data);  
  }
  onpromoCodeFormFormSubmit(){
    this.promoCodeForm.get('subscription_types').setValue(this.selectedSubscriptions);
    if(this.promoCodeForm.valid){
      this.formSubmiting = true;
      if(this.promoCodeForm.value.id){
        this.adminS.editCodePromo(this.promoCodeForm.value).subscribe(
          data => { console.log(data); },
          error => {},
          () => { this.formSubmiting = false }
        )
      }else{
        this.adminS.addCodePromo(this.promoCodeForm.value).subscribe(
          data => { console.log(data); },
          error => {},
          () => { this.formSubmiting = false }
        )
      }
      this.cancel();
      this.getAllPromoCodes();
    }
  }

  cancel(){
    this.selectedSubscriptions = [];
    this.promoCodeForm.reset();
    this.getCode();
  }

  changeStatus(el, index){
    this.adminS.changeStatusPromoCode(el.id).subscribe(
      data => {
        this.codePromoList.data[index].status = data.status;
        this.refrechDataSource();
      }
    )
  }

  edit(el, index){
    this.adminS.deleteCodePromo(el.id).subscribe(
      data => {
        this.promoCodeForm.get('id').setValue(data.data.id);
        this.promoCodeForm.get('start_date').setValue( new Date(data.data.start_date) );
        this.promoCodeForm.get('end_date').setValue( new Date(data.data.end_date) );
        this.promoCodeForm.get('promo_code').setValue( data.data.promo_code );
        this.promoCodeForm.get('maximum').setValue( data.data.no_maximum ? 0 : data.data.max_uses_number );
        let index = this.numbers.findIndex(el => el.value == data.data.gratuity_duration);
        this.promoCodeForm.get('gratuity_duration').setValue( this.numbers[index] );
        this.selectedSubscriptions = data.data.applicable_to;
      }
    )
  }

  compareFn(c1, c2): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
}

  delete(el, index){
    const dialog = this.dialog.open( ConfirmationComponent , {
      data : {
        title: 'ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_CODE',
        content: "THIS_PROMO_CODE_WILL_BE_PERMANENTLY_DELETED_ARE_YOU_SURE_YOU_WANT_TO_DELETE_IT",
        confirmBtn: 'CONFIRMER',
        cancelBtn: 'CANCEL' 
      },
      width: '500px',
      height: 'auto',
      disableClose: true
    });
    dialog.afterClosed().subscribe(result => {
      if(result && result.confirm){
        this.adminS.deleteCodePromo(el.id).subscribe(
          data => {
            this.codePromoList.data.splice(index, 1 );
            this.refrechDataSource();
          }
        )
      }
    })
  }

}
