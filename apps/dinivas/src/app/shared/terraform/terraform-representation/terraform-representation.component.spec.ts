import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TerraformRepresentationComponent } from './terraform-representation.component';

describe('TerraformRepresentationComponent', () => {
  let component: TerraformRepresentationComponent;
  let fixture: ComponentFixture<TerraformRepresentationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TerraformRepresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerraformRepresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
