import { CollectionList } from './../resources/collections/collection';
import { RepoCollectionSearchService } from './../resources/combined/combined.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Content,
  PaginatedCombinedSearch
} from '../resources/combined/combined';
import * as moment from 'moment';

@Component({
  selector: 'dinivas-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  contentCount: number;
  searchTerm = '';
  contentItems: Content[];

  collectionCount: number;
  collectionItems: CollectionList[];

  constructor(
    private route: ActivatedRoute,
    private searchService: RepoCollectionSearchService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.route.data.subscribe(data => {
        if (data.content.content && data.content.collection) {
          this.prepareContent(data.content);
        }
      });
    });
  }
  private prepareContent(result: PaginatedCombinedSearch) {
    this.contentCount = result.content.count;
    this.collectionCount = result.collection.count;

    const datePattern = /^\d{4}.*$/;
    result.content.results.forEach(item => {
      if (item.imported === null) {
        item.imported = 'NA';
      } else if (datePattern.exec(item.imported) !== null) {
        item.imported = moment(item.imported).fromNow();
      }
      item['repository_format'] = item.summary_fields['repository']['format'];
      item['avatar_url'] =
        item.summary_fields['namespace']['avatar_url'] || '/assets/avatar.png';
      if (!item.summary_fields['namespace']['is_vendor']) {
        // always show namespace name for community contributors
        item['namespace_name'] = item.summary_fields['namespace']['name'];
      } else {
        // for vendors, assume name is in logo
        item['namespace_name'] = item.summary_fields['namespace']['avatar_url']
          ? ''
          : item.summary_fields['namespace']['name'];
      }
      item['displayNamespace'] = item.summary_fields['namespace']['name'];

      // Determine navigation for item click
      const namespace = item.summary_fields['namespace']['name'].toLowerCase();
      const repository = item.summary_fields['repository'][
        'name'
      ].toLowerCase();
      const name = item.name.toLowerCase();
      item['contentLink'] = `/${namespace}/${repository}`;
      if (item['repository_format'] === RepoFormats.multi) {
        item['contentLink'] += `/${name}`;
      }
    });

    const count = this.collectionCount + this.contentCount;

    this.contentItems = result.content.results;
    this.collectionItems = result.collection.results;
  }
}

export enum RepoFormats {
  apb = 'apb',
  role = 'role',
  multi = 'multi'
}

export enum RepoFormatsIconClasses {
  apb = 'pficon-bundle',
  role = 'fa fa-gear',
  multi = 'pficon-repository'
}

export enum RepoFormatsTooltips {
  apb = 'Ansible Playbook Bundle',
  role = 'Ansible Role',
  multi = 'Multi-content Repository'
}
