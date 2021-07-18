import { ImportsService } from './../resources/imports/imports.service';
import { Observable } from 'rxjs';
import { PagedResponse } from './../resources/paged-response';
import { Namespace } from './../resources/namespaces/namespace';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';
import { map } from 'rxjs/operators';
import { ImportList, RepoImport } from '../resources/imports/import';

@Component({
  selector: 'dinivas-my-import',
  templateUrl: './my-import.component.html',
  styleUrls: ['./my-import.component.scss']
})
export class MyImportComponent implements OnInit {
  selectedNamespace: Namespace;
  namespaces: Namespace[] = [];
  repositoryImports: Observable<ImportList[]>;
  currentRepoImport: RepoImport;

  constructor(
    private route: ActivatedRoute,
    private importsService: ImportsService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      const results = data['namespaces'] as PagedResponse;
      this.namespaces = this.prepForList(results.results as Namespace[]) || [];
      if (this.namespaces.length > 0) {
        this.selectedNamespace = this.namespaces[0];
        this.refreshImportList();
        this.repositoryImports.subscribe(repositoryImports =>
          this.selectRepository(repositoryImports[0])
        );
      }
    });
  }

  refreshImportList() {
    this.repositoryImports = this.importsService
      .get_import_list(this.selectedNamespace.id)
      .pipe(map(t => t.results as ImportList[]));
  }

  selectRepository(repositoryImport: ImportList) {
    this.importsService
      .get_repo_import(repositoryImport.id)
      .subscribe(repoImport => {
        this.currentRepoImport = repoImport;
      });
  }

  private prepForList(namespaces: Namespace[]): Namespace[] {
    const clonedNamespaces = cloneDeep(namespaces);
    return clonedNamespaces;
  }
}
