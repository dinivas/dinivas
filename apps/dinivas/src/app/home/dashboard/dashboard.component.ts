import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from './../../shared/project/projects.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Label } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'dinivas-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { id: 1, title: 'Resources Overview', cols: 1, rows: 1 },
          { id: 2, title: 'Card 2', cols: 1, rows: 1 },
          { id: 3, title: 'Card 3', cols: 1, rows: 1 },
          { id: 4, title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { id: 1, title: 'Resources Overview', cols: 2, rows: 1 },
        { id: 2, title: 'Card 2', cols: 1, rows: 1 },
        { id: 3, title: 'Card 3', cols: 1, rows: 2 },
        { id: 4, title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left'
    }
  };
  public pieChartRamLabels: Label[] = ['In use', 'Limit', 'Reserved'];
  public pieChartRamData: number[];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private projectService: ProjectsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.projectService
        .getProjects(new HttpParams())
        .subscribe((data: any) => {
          data.items
            .filter(p => p.id == params['project'])
            .forEach(p => {
              this.projectService.getProjectQuota(p.id).subscribe(quota => {
                this.pieChartRamData = [
                  quota.ram.in_use / 1024,
                  quota.ram.limit / 1024,
                  quota.ram.reserved / 1024
                ];
              });
            });
        });
    });
  }
}
