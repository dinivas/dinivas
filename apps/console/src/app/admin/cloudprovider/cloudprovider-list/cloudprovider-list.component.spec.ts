import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';

import { CloudproviderListComponent } from './cloudprovider-list.component';

describe('ListComponent', () => {
  let component: CloudproviderListComponent;
  let fixture: ComponentFixture<CloudproviderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudproviderListComponent ],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudproviderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
