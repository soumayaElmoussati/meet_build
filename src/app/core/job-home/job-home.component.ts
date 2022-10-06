import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-job-home',
  templateUrl: './job-home.component.html',
  styleUrls: ['./job-home.component.scss']
})
export class JobHomeComponent implements OnInit {

  opened: boolean;

  constructor() { }

  ngOnInit(): void {
  }


  menuStatusChange(opened){
    this.opened = opened;
  }


}
