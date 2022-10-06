import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslocoService, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-admin-invoices',
  templateUrl: './admin-invoices.component.html',
  styleUrls: ['./../admin.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'admin'
    }
  ]
})
export class AdminInvoicesComponent implements OnInit {

  invoicesList: any;
  displayedColumns: string[] = ['date', 'number', 'invoice', 'amount', 'pdf'];
  invoicesDataSource = new MatTableDataSource(<any>[]);
  currentPage: number = 1;
  pagination = [];
  perPage: number = 9;
  startDate = new FormControl();
  endDate = new FormControl();
  maxDate = new Date();

  constructor(
    private adminS: AdminService,
    private profileS: ProfileService,
    private router: Router,
    private translocoS: TranslocoService,
    private datePipe: DatePipe
  ) {
    this.translocoS.selectTranslate('BILLING', null, 'admin').subscribe(value => this.adminS.dataTitle.next(value));
    this.adminS.dataSubTitle.next(null);
    this.adminS.dataBackTo.next('/admin');
    this.adminS.currentLinkParam.next({ parent:4, child:0 });}

  ngOnInit(): void {
    this.getInvoices();
    this.startDate.valueChanges.subscribe(
      data => { if(this.rangeSelected() ) this.getInvoices(); }
    )
    this.endDate.valueChanges.subscribe(
      data => { if(this.rangeSelected() ) this.getInvoices(); }
    )
  }

  rangeSelected(): boolean{
    if(this.startDate.value && this.endDate.value) return true;
    return false;
  }

  getInvoices(){
    const data = {
      perPage: this.perPage,
      start_date: this.datePipe.transform(this.startDate.value, 'dd-MM-yyyy' ),
      end_date: this.datePipe.transform(this.endDate.value, 'dd-MM-yyyy' )
    };
    this.adminS.getInvoices(data, this.currentPage).subscribe(
      data => {
        this.invoicesList = data;
        this.refrechDataSource();
        this.generatePagination();
      }
    )
  }
  refrechDataSource(){
    this.invoicesDataSource = new MatTableDataSource(this.invoicesList.data);  
  }
  generatePagination(){
    this.pagination = [];
    for( let i = 1 ; i <= this.invoicesList.last_page ; i++ ){
      this.pagination.push(i);
    }
  }
  navigateTo(page){
    this.currentPage = page;
    this.getInvoices();
  }
  onDownloadFile(file, number){
    this.profileS.downloadInvoice(file).subscribe(
      data => {
        let file = new Blob([<any>data], { type: 'application/pdf' });
        let url = window.URL.createObjectURL(file);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = number;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    )
  }
  onExport(){
    const data = {
      start_date: this.datePipe.transform(this.startDate.value, 'dd-MM-yyyy' ),
      end_date: this.datePipe.transform(this.endDate.value, 'dd-MM-yyyy' )
    };
    this.adminS.downloadInvoices(data).subscribe(
      data => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(data);
        a.href = objectUrl;
        a.download = 'factures.zip';
        a.click();
        URL.revokeObjectURL(objectUrl);;
      }
    )
  }

}
