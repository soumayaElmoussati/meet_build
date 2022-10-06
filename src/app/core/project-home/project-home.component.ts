import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-home',
  templateUrl: './project-home.component.html',
  styleUrls: ['./project-home.component.scss']
})
export class ProjectHomeComponent implements OnInit {

  opened: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  menuStatusChange(opened){
    this.opened = opened;
  }

}
