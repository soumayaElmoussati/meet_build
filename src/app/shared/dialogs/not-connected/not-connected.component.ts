import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-not-connected',
  templateUrl: './not-connected.component.html',
  styleUrls: ['./not-connected.component.scss']
})
export class NotConnectedComponent implements OnInit {

  
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NotConnectedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

  ngOnInit(): void {
    
  }
  setRouter(path){
    this.router.navigateByUrl(path);
    this.dialogRef.close();
  }
  goToLogin(){
    this.router.navigateByUrl('/login?redirectTo='+this.router.url);
    this.dialogRef.close();
  }
  
}
