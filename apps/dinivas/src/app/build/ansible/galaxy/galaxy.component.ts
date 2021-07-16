import { Component, OnInit } from '@angular/core';
import { GalaxyService } from './galaxy.service';

@Component({
  selector: 'dinivas-galaxy',
  templateUrl: './galaxy.component.html',
  styleUrls: ['./galaxy.component.scss']
})
export class GalaxyComponent implements OnInit {
  constructor(
    private readonly galaxyService: GalaxyService
  ) {}

  ngOnInit() {
    this.galaxyService.api().subscribe(api => console.log(api));
  }
}
