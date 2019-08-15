import { ActivatedRoute } from '@angular/router';
import { Namespace } from './../resources/namespaces/namespace';
import { Component, OnInit } from '@angular/core';
import { PagedResponse } from '../resources/paged-response';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'dinivas-my-content',
  templateUrl: './my-content.component.html',
  styleUrls: ['./my-content.component.scss']
})
export class MyContentComponent implements OnInit {
  items: Namespace[] = [];
  namespaces: Namespace[] = [];
  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      const results = data['namespaces'] as PagedResponse;
      this.items = this.prepForList(results.results as Namespace[]);
      if (results.count === 1) {
          this.items[0]['expanded'] = true;
      }
  });
  }

  private prepForList(namespaces: Namespace[]): Namespace[] {
    const clonedNamespaces = cloneDeep(namespaces);
    return clonedNamespaces;
}
}
