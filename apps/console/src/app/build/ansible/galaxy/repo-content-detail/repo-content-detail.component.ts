import { Repository } from './../resources/repositories/repository';
import { CollectionDetail } from './../resources/collections/collection';
import { CollectionImport } from './../resources/imports/import';
import { Content, ContentFormat } from './../resources/combined/combined';
import { Namespace } from './../resources/namespaces/namespace';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  content: Content[];
  namespace: Namespace;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.contentType = data.contentType['type'];
      this.collection = data.contentType['data']['collection'];
      this.collection_import = data.contentType['data']['collection_import'];
      this.repository = data.contentType['data']['repository'];
      this.content = data.contentType['data']['content'];
      this.namespace = data.contentType['data']['namespace'];
    });
  }
}
