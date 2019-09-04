import { RepositoryService } from './../resources/repositories/repository.service';
import { PluginTypes } from './../enums/plugin-types.enum';
import { PagedResponse } from './../resources/paged-response';
import { RepoFormats } from './../search/search.component';
import { ContentService } from './../resources/content/content.service';
import { Repository } from './../resources/repositories/repository';
import { CollectionDetail } from './../resources/collections/collection';
import { CollectionImport } from './../resources/imports/import';
import { ContentFormat } from './../resources/combined/combined';
import { Content } from './../resources/content/content';
import { Content as CombinedContent } from './../resources/combined/combined';
import { Namespace } from './../resources/namespaces/namespace';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { RepositoryImport } from '../resources/repository-imports/repository-import';
import { map, tap } from 'rxjs/operators';
import { MatTabGroup } from '@angular/material';

class ContentTypeCounts {
  apb: number;
  module: number;
  moduleUtils: number;
  plugin: number;
  role: number;
}

@Component({
  selector: 'dinivas-repo-content-detail',
  templateUrl: './repo-content-detail.component.html',
  styleUrls: ['./repo-content-detail.component.scss']
})
export class RepoContentDetailComponent implements OnInit {
  contentType: ContentFormat;
  repository: Repository;
  collection: CollectionDetail;
  collection_import: CollectionImport;
  content: CombinedContent[];
  namespace: Namespace;
  hasReadme = false;
  hasMetadata = false;
  metadataFilename = '';
  repoContent: Content;
  metadata: object;
  pageLoading = true;
  selectedContent: Content;
  repositoryImports: Observable<RepositoryImport[]>;

  @ViewChild(MatTabGroup, { static: true })
  historyTabGroup: MatTabGroup;

  contentCounts: ContentTypeCounts = {
    apb: 0,
    module: 0,
    moduleUtils: 0,
    plugin: 0,
    role: 0
  } as ContentTypeCounts;

  constructor(
    private route: ActivatedRoute,
    private contentService: ContentService,
    private repositoryService: RepositoryService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.contentType = data.contentType['type'];
      this.collection = data.contentType['data']['collection'];
      this.collection_import = data.contentType['data']['collection_import'];
      this.repository = data.contentType['data']['repository'];
      this.content = data.contentType['data']['content'];
      this.namespace = data.contentType['data']['namespace'];
      this.fetchContentDetail(this.content[0].id);
      // Load repo imports
      this.repositoryImports = this.repositoryService
        .getImports(this.repository.id, {})
        .pipe(
          map(t => t.results as RepositoryImport[]),
          tap(t =>
            setTimeout(() => {
              this.historyTabGroup.selectedIndex = 0;
            }, 2)
          )
        );
    });
  }

  private fetchContentDetail(id: number) {
    this.contentService.get(id).subscribe(result => {
      this.repoContent = JSON.parse(JSON.stringify(result));
      this.hasMetadata = false;
      this.metadataFilename = '';
      this.metadata = null;
      this.hasReadme = false;
      if (this.repoContent.content_type === RepoFormats.role) {
        if (this.repoContent.metadata['container_meta']) {
          this.hasMetadata = true;
          this.metadataFilename = 'container.yml';
          this.metadata = this.repoContent.metadata['container_meta'];
        }
        this.hasReadme = this.repoContent.readme_html ? true : false;
      }
      if (this.repoContent.content_type === RepoFormats.apb) {
        if (this.repoContent.metadata['apb_metadata']) {
          this.hasMetadata = true;
          this.metadataFilename = 'apb.yml';
          this.metadata = this.repoContent.metadata['apb_metadata'];
        }
        this.hasReadme = this.repoContent.readme_html ? true : false;
      }
      if (this.repository.format === RepoFormats.multi) {
        if (this.repository.readme_html) {
          this.hasReadme = true;
          this.repoContent.readme_html = this.repository.readme_html;
        }
      }
      // Make it easier to access related data
      [
        'platforms',
        'versions',
        'cloud_platforms',
        'task_messages',
        'dependencies'
      ].forEach(key => {
        this.repoContent[key] = this.repoContent.summary_fields[key];
        let hasKey = 'has' + key[0].toUpperCase() + key.substring(1);
        hasKey = hasKey.replace(/\_(\w)/, this.toCamel);
        this.repoContent[hasKey] =
          this.repoContent[key] && this.repoContent[key].length ? true : false;
      });
      if (this.repository.format === RepoFormats.multi) {
        this.getContentTypeCounts();
      }
      this.pageLoading = false;
    });
  }
  private toCamel(
    match: string,
    p1: string,
    offset: number,
    value: string
  ): string {
    return p1.toUpperCase();
  }
  private getContentTypeCounts(page?: number) {
    const params = { repository__id: this.repository.id };
    if (page) {
      params['page'] = page;
    }
    this.contentService
      .pagedQuery(params)
      .subscribe((result: PagedResponse) => {
        result.results.forEach(item => {
          const ct = item['content_type'];
          if (PluginTypes[ct]) {
            this.contentCounts.plugin++;
          } else {
            const ctKey = ct.replace(/\_(\w)/, this.toCamel);
            this.contentCounts[ctKey]++;
          }
        });
        if (result.next) {
          const matches = result.next.match(/page=(\d+)/);
          this.getContentTypeCounts(parseInt(matches[1], 10));
        }
      });
  }
}
