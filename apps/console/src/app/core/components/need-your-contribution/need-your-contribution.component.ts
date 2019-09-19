import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dinivas-need-your-contribution',
  templateUrl: './need-your-contribution.component.html',
  styleUrls: [] // components styles are imported in assets/styles/components.scss
})
export class NeedYourContributionComponent implements OnInit {

  @Input()
  moduleName: string;

  constructor() { }

  ngOnInit() {
  }

}
