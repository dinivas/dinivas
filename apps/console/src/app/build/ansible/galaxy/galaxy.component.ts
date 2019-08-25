import { RepositoryService } from './resources/repositories/repository.service';
import { Component, OnInit } from '@angular/core';
import { GalaxyService } from './galaxy.service';
import {Repository} from './resources/repositories/repository'

@Component({
  selector: 'dinivas-galaxy',
  templateUrl: './galaxy.component.html',
  styleUrls: ['./galaxy.component.scss']
})
export class GalaxyComponent implements OnInit {
  constructor(
    private readonly galaxyService: GalaxyService,
    private readonly repositoryService: RepositoryService
  ) {}

  ngOnInit() {
    this.galaxyService.api().subscribe(api => console.log(api));
  }

  importRole() {
    const newRepo = new Repository();
    newRepo.name = 'ansible-role-springboot';
    newRepo.original_name = 'ansible-role-springboot';
    newRepo.description = 'ansible-role-springboot';
    newRepo.provider_namespace = 'orachide';
    newRepo.is_enabled = true;
    this.repositoryService.save(newRepo).subscribe(res => console.log(res));
  }
}
