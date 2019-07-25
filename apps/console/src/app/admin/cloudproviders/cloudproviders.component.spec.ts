import { CloudprovidersComponent } from './cloudproviders.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';


describe('ListComponent', () => {
  let component: CloudprovidersComponent;
  let fixture: ComponentFixture<CloudprovidersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudprovidersComponent ],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudprovidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
