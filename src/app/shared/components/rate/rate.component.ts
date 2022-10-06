import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HelpersService } from '../../services/helpers.service';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {

  @Input() rate;
  @Input() first;
  profileImgUrl = environment.profileImgUrl;

  constructor(
    private helpersS: HelpersService, // used on component
  ) { }

  ngOnInit(): void {
  }

}
