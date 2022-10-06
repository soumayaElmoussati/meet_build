import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-assign-model',
  templateUrl: './assign-model.component.html',
  styleUrls: ['./assign-model.component.scss']
})
export class AssignModelComponent implements OnInit {

  profileImgUrl = environment.profileImgUrl;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AssignModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

  ngOnInit(): void {
    
  }

  onCancel(){
    this.dialogRef.close();
  }

  onConfirm(){
    this.dialogRef.close({
      confirm: true,
    });
  }
  

}
