import { AdminIamService } from './../../../../shared/admin-iam/admin-iam.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { UserRepresentation } from '@dinivas/api-interfaces';

@Component({
  selector: 'dinivas-admin-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class AdminIAMMemberEditComponent implements OnInit {
  user: UserRepresentation;

  constructor(
    private adminIamService: AdminIamService,
    private readonly router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject('contextualData') private readonly contextualData: any
  ) {
    console.log(this.contextualData);
  }

  ngOnInit() {
  }
}
