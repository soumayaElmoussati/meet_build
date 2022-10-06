import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { CurrentPageService } from 'src/app/shared/services/current-page.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-my-invoices',
  templateUrl: './my-invoices.component.html',
  styleUrls: ['./my-invoices.component.scss'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class MyInvoicesComponent implements OnInit {

  displayedColumns: string[] = ['action', 'date', 'invoice', 'amount', 'pdf'];
  invoicesList: any;
  invoicesDataSource = new MatTableDataSource(<any>[]);
  results = [5, 10, 25, 50, 100];
  resultPerPage = new FormControl(10);
  startDate = new FormControl();
  endDate = new FormControl();
  maxDate = new Date();
  selection = new SelectionModel<any>(true, []);

  
  currentPage = 1;

  constructor(
    private profileS: ProfileService,
    private datePipe: DatePipe,
    private currentPageS: CurrentPageService
  ) { }

  ngOnInit(): void {
    this.currentPageS.meCurrentLink.next('factures');
    this.getInvoices();
    this.resultPerPage.valueChanges.subscribe(
      data => { this.getInvoices(); }
    )
    this.startDate.valueChanges.subscribe(
      data => { if(this.startDate.value && this.endDate.value) this.getInvoices(); }
    )
    this.endDate.valueChanges.subscribe(
      data => { if(this.startDate.value && this.endDate.value) this.getInvoices(); }
    )
  }

  getInvoices(){
    let data: any;
    if(this.startDate.value && this.endDate.value){
      data = {
        perPage: this.resultPerPage.value,
        start_date: this.datePipe.transform(this.startDate.value, 'dd-MM-yyyy' ),
        end_date: this.datePipe.transform(this.endDate.value, 'dd-MM-yyyy' )
      };  
    }else{
      data = {
        perPage: this.resultPerPage.value,
      };
    }
    this.profileS.getMyInvoices(data, this.currentPage ).subscribe(
      data => { this.invoicesList = data },
      error => {},
      () => { this.refrechDataSource() }
    )
  }

  refrechDataSource(){
    this.invoicesDataSource = new MatTableDataSource(this.invoicesList.data);  
  }

  onExport(){
    this.selection.selected.forEach(element => {
      this.onDownloadFile(element.id, element.number);
    });
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.invoicesDataSource.data.length;
    return numSelected === numRows;
  }

  changeSelection(e, i){
    if(!e.checked){
      var obj = this.invoicesDataSource.data;
      this.invoicesDataSource.data = [...obj];
      this.invoicesDataSource = new MatTableDataSource(obj);
    }
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.invoicesDataSource.data.forEach(row => this.selection.select(row));
  }

  navigateTo(page){
    this.currentPage = page;
    this.getInvoices();
  }

}
