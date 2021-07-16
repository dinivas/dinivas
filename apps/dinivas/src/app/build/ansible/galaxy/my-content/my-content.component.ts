import { RepositoryImportService } from './../resources/repository-imports/repository-import.service';
import { RepoCollectionListService } from './../resources/combined/combined.service';
import { ProviderNamespace } from './../resources/provider-namespaces/provider-namespace';
import { RepositoryService } from './../resources/repositories/repository.service';
import { Repository } from '../resources/repositories/repository';
import { UserService, IMe } from './../resources/users/user.service';
import { NamespaceService } from './../resources/namespaces/namespace.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RepositorySource } from './../resources/repositories/repository-source';
import { ProviderSourceService } from './../resources/provider-namespaces/provider-source.service';
import { ActivatedRoute } from '@angular/router';
import { Namespace } from './../resources/namespaces/namespace';
import { ProviderSource } from './../resources/provider-namespaces/provider-source';
import { Component, OnInit, Inject } from '@angular/core';
import { PagedResponse } from '../resources/paged-response';
import { User } from '../resources/users/user';
import {
  cloneDeep,
  groupBy,
  filter as _filter,
  countBy,
} from 'lodash';
import { map, filter, flatMap, toArray } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { PageLoadingService } from '../../../../core/services/page-loading.service';
import { MatListOption } from '@angular/material/list';

@Component({
  selector: 'dinivas-my-content',
  templateUrl: './my-content.component.html',
  styleUrls: ['./my-content.component.scss']
})
export class MyContentComponent implements OnInit {
  namespaces: Namespace[] = [];
  providerSources: ProviderSource[];
  repositorySources: RepositorySource[] = [];
  // eslint-disable-next-line @typescript-eslint/ban-types
  repositoryByNamespaceAndPns: {} = {};
  me: IMe;

  displayedColumns = ['name', 'status', 'score', 'date', 'row-actions'];

  constructor(
    private route: ActivatedRoute,
    private providerSourceService: ProviderSourceService,
    private namespaceService: NamespaceService,
    private repositoryService: RepositoryService,
    private repositoryImportService: RepositoryImportService,
    private userService: UserService,
    private repoCollectionListService: RepoCollectionListService,
    private pageLoadingService: PageLoadingService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      const results = data['namespaces'] as PagedResponse;
      this.providerSources = data['providerSources'] as ProviderSource[];
      this.namespaces = this.prepForList(results.results as Namespace[]) || [];
      if (results.count === 1) {
        this.namespaces[0]['expanded'] = true;
      }
      if (this.namespaces.length > 0) {
        this.namespaces.forEach(namespace => {
          this.repositoryByNamespaceAndPns[namespace.name] = {};
          namespace.summary_fields.provider_namespaces.forEach(
            (pns: ProviderNamespace) => {
              this.repositoryByNamespaceAndPns[namespace.name][
                pns.name
              ] = this.repositoryByNamespaceAndPNS(namespace.name, pns.name);
            }
          );
        });
      }
    });
    this.userService.me().subscribe(me => (this.me = me));
  }

  refreshContent() {
    this.namespaceService
      .pagedQuery({
        owners__username: this.me.username
      })
      .subscribe(
        pagedResponse =>
          (this.namespaces =
            this.prepForList(pagedResponse.results as Namespace[]) || [])
      );
  }

  deleteRepository(repository: Repository) {
    this.repositoryService
      .destroy(repository)
      .subscribe(() => this.refreshContent());
  }

  deprecateRepository(repository: Repository, isDeprecated: boolean) {
    repository.deprecated = isDeprecated;
    this.repositoryService
      .save(repository)
      .subscribe(() => this.refreshContent());
  }

  importRepository(repository: Repository) {
    // Start an import
    this.repositoryImportService
      .save({ repository_id: repository.id })
      .subscribe(() => {
        this.refreshContent();
      });
  }

  repositoryByNamespaceAndPNS(
    namespaceName,
    pnsName
  ): Observable<Repository[]> {
    return this.repoCollectionListService
      .query({ namespace: namespaceName })
      .pipe(
        map(pRC => {
          return pRC.repository.results;
        }),
        flatMap(t => t),
        filter(repo => repo.summary_fields.provider_namespace.name === pnsName),
        toArray()
      );
  }
  private prepForList(namespaces: Namespace[]): Namespace[] {
    const clonedNamespaces = cloneDeep(namespaces);
    return clonedNamespaces;
  }

  addNamespace() {
    this.pageLoadingService.setPageLoading(true);
    const selectNamespaceDialogRef = this.dialog.open(
      SelectNamespaceDialogComponent,
      {
        width: '400px',
        data: {
          providerSources: this.providerSources,
          namespaces: this.namespaces
        }
      }
    );
    selectNamespaceDialogRef
      .afterOpened()
      .subscribe(() => this.pageLoadingService.setPageLoading(false));
    selectNamespaceDialogRef
      .afterClosed()
      .subscribe(
        (res: {
          referenceProviderSource: ProviderSource;
          selectedPns: ProviderSource[];
        }) => {
          if (res) {
            console.log(res);
            this.userService.me().subscribe((me: IMe) => {
              let namespaceToAdd: Namespace;
              let pns: ProviderNamespace[] = [];
              if (this.namespaces.length > 0) {
                namespaceToAdd = this.namespaces[0];
                pns = pns.concat(
                  namespaceToAdd.summary_fields.provider_namespaces
                );
              } else {
                namespaceToAdd = new Namespace();
                const providerSourceToAdd = res.referenceProviderSource;
                namespaceToAdd.name = `${providerSourceToAdd.provider_name.toLowerCase()}_${
                  providerSourceToAdd.name
                }`;
                namespaceToAdd.description = providerSourceToAdd.description;
                namespaceToAdd.company = providerSourceToAdd.company;
                namespaceToAdd.location = providerSourceToAdd.location;
                namespaceToAdd.avatar_url = providerSourceToAdd.avatar_url;
                namespaceToAdd.html_url = providerSourceToAdd.html_url;
                namespaceToAdd.active = true;
                namespaceToAdd.is_vendor = false;
                const currentOwner: User = new User();
                currentOwner.id = me.id;
                namespaceToAdd.owners = [currentOwner];
              }
              res.selectedPns.forEach((item: ProviderSource) => {
                const pn: ProviderNamespace = new ProviderNamespace();
                pn.description = item.description;
                pn.html_url = item.html_url;
                pn.display_name = item.display_name;
                pn.name = item.name;
                pn.company = item.company;
                pn.avatar_url = item.avatar_url;
                pn.location = item.location;
                pn.provider = item.provider;
                pn.provider_name = item.provider_name;
                pn.email = item.email;
                pns.push(pn);
              });
              namespaceToAdd.provider_namespaces = pns;
              this.namespaceService.save(namespaceToAdd).subscribe(() => {
                this.refreshContent();
              });
            });
          }
        }
      );
  }
  addRepoSources(providerNamespace: ProviderNamespace) {
    this.pageLoadingService.setPageLoading(true);
    this.providerSourceService
      .getRepoSources({
        providerName: 'github',
        name: providerNamespace.name
      })
      .subscribe(
        repoSources => {
          const selectRepoDialogRef = this.dialog.open(
            SelectRepoDialogComponent,
            {
              width: '600px',
              data: {
                repoSources: repoSources,
                providerNamespace
              }
            }
          );
          selectRepoDialogRef
            .afterOpened()
            .subscribe(() => this.pageLoadingService.setPageLoading(false));
          selectRepoDialogRef.afterClosed().subscribe((repos: Repository[]) => {
            console.log('Imported repos to import', repos);
          });
        },
        () => {
          this.pageLoadingService.setPageLoading(false);
        }
      );
  }
}

@Component({
  templateUrl: './select-namespace-dialog.component.html'
})
export class SelectNamespaceDialogComponent implements OnInit {
  providerSources: ProviderSource[] = [];
  selectedProviderSource: any;
  providerSourcesGroup: any;
  constructor(
    public dialogRef: MatDialogRef<SelectNamespaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { providerSources: ProviderSource[]; namespaces: Namespace[] }
  ) {}
  ngOnInit() {
    this.providerSources = this.data.providerSources;
    // group by provider and if existing at least one namespace for a provider remove it
    this.providerSourcesGroup = _filter(
      groupBy(this.data.providerSources, 'provider_name'),
      group => {
        if (
          this.data.namespaces.length == 1 &&
          countBy(
            Object.keys(group),
            key => this.data.namespaces[0].name.indexOf(key) > -1
          )
        ) {
          this.selectedProviderSource = _filter(
            group,
            g => this.data.namespaces[0].name.indexOf(g.name) > -1
          )[0];
          this.providerSources = _filter(this.providerSources, ps => {
            return (
              countBy(
                this.data.namespaces[0].summary_fields.provider_namespaces,
                n => n.name === ps.name
              ).true != 1
            );
          });
          return false;
        } else {
          return true;
        }
      }
    );
  }
  onSelect(
    providerSource: ProviderSource,
    selectedPnsListOption: MatListOption[]
  ) {
    this.dialogRef.close({
      referenceProviderSource: providerSource,
      selectedPns: selectedPnsListOption.map(option => option.value)
    });
  }
  cancel() {
    this.dialogRef.close();
  }
}

@Component({
  templateUrl: './select-repository-dialog.component.html'
})
export class SelectRepoDialogComponent implements OnInit {
  repositorySources: RepositorySource[] = [];
  selectedRepositorySource: RepositorySource;
  providerNamespace: ProviderNamespace;
  constructor(
    public dialogRef: MatDialogRef<SelectRepoDialogComponent>,
    private repositoryService: RepositoryService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      repoSources: RepositorySource[];
      providerNamespace: ProviderNamespace;
    }
  ) {}
  ngOnInit() {
    this.repositorySources = this.data.repoSources;
    this.providerNamespace = this.data.providerNamespace;
  }
  onSelect(selectedListOption: MatListOption[]) {
    const repoSources: RepositorySource[] = selectedListOption.map(
      option => option.value
    );
    const saveRequests: Observable<Repository>[] = [];
    repoSources.forEach(repoSource => {
      const newRepo = new Repository();
      newRepo.name = repoSource.name;
      newRepo.original_name = repoSource.name;
      newRepo.description = repoSource.description
        ? repoSource.description
        : repoSource.name;
      newRepo.provider_namespace = this.providerNamespace.id;
      newRepo.is_enabled = true;
      saveRequests.push(this.repositoryService.save(newRepo));
    });
    forkJoin(saveRequests).subscribe((results: Repository[]) => {
      this.dialogRef.close(results);
    });
  }
  cancel() {
    this.dialogRef.close();
  }
}
