import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerraformStateComponent } from './terraform-state.component';

describe('TerraformStateComponent', () => {
  let component: TerraformStateComponent;
  let fixture: ComponentFixture<TerraformStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerraformStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerraformStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
