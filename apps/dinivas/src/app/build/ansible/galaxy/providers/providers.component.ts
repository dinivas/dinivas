import { Provider } from './../resources/providers/provider';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dinivas-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent implements OnInit {
  providers: Provider[];
  displayedColumns: string[] = ['id', 'name', 'description', 'active'];
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.route.data.subscribe(data => {
        this.providers = data.providers.results;
      });
    });
  }
}
