import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerraformModuleWizardComponent } from './terraform-module-wizard.component';

describe('TerraformModuleWizardComponent', () => {
  let component: TerraformModuleWizardComponent;
  let fixture: ComponentFixture<TerraformModuleWizardComponent>;

  beforeEach(async(() => {
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
