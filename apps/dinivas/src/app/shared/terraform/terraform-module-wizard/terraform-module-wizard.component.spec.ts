import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TerraformModuleWizardComponent } from './terraform-module-wizard.component';

describe('TerraformModuleWizardComponent', () => {
  let component: TerraformModuleWizardComponent<any>;
  let fixture: ComponentFixture<TerraformModuleWizardComponent<any>>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TerraformModuleWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerraformModuleWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
