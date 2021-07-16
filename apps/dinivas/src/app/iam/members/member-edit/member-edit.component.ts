import { IamService } from './../../../shared/iam/iam.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserRepresentation } from '@dinivas/api-interfaces';

@Component({
  selector: 'dinivas-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  user: UserRepresentation;

  constructor(
    private iamService: IamService,
    private readonly router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const memberId = params['memberId'];
      if (memberId) {
        this.iamService.getOneUser(memberId).subscribe(user => {
          this.user = user;
          console.log(this.user);
        });
      }
    });
  }
}
