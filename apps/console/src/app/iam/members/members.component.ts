import { HttpParams } from '@angular/common/http';
import { IamService } from './../../shared/iam/iam.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dinivas-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  members: any[];
  constructor(private iamService: IamService) { }

  ngOnInit() {
    this.iamService.getAllUsers(new HttpParams()).subscribe((users: any[])=>{
      this.members = users;
    });
  }

}
