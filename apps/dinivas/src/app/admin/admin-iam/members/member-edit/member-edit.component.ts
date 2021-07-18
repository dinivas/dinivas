import { Component, OnInit, Inject } from '@angular/core';
import { UserRepresentation } from '@dinivas/api-interfaces';

@Component({
  selector: 'dinivas-admin-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss'],
})
export class AdminIAMMemberEditComponent implements OnInit {
  user: UserRepresentation;

  constructor(@Inject('contextualData') private readonly contextualData: any) {
    console.log(this.contextualData);
  }

  ngOnInit() {}
}
