import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-cv-home',
  templateUrl: './my-cv-home.component.html',
  styleUrls: ['./my-cv-home.component.scss']
})
export class MyCvHomeComponent implements OnInit {

  constructor() { }

  opened: boolean = false;

  ngOnInit(): void {
  }
  
  menuStatusChange(opened){
    this.opened = opened;
  }

}
