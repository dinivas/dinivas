import { Type } from '@angular/core';

export class TerraformModuleWizard<T> {
  component: Type<any>;
  backButtonRouterLink: string[];
  moduleEntity: T;
  moduleEntityName: string;
  moduleLabel: string;
  supportSingleTier: boolean;
  supportMultiTier: boolean;
  supportDocker: boolean;
  supportKubernetes: boolean;
  constructor(
    component: Type<any>,
    backButtonRouterLink: string[],
    moduleEntity: T,
    moduleEntityName: string,
    moduleLabel: string,
    supportSingleTier: boolean,
    supportMultiTier: boolean,
    supportDocker: boolean,
    supportKubernetes: boolean
  ) {
    this.component = component;
    this.backButtonRouterLink = backButtonRouterLink;
    this.moduleEntity = moduleEntity;
    this.moduleEntityName = moduleEntityName;
    this.moduleLabel = moduleLabel;
    this.supportSingleTier = supportSingleTier;
    this.supportMultiTier = supportMultiTier;
    this.supportDocker = supportDocker;
    this.supportKubernetes = supportKubernetes;
  }
}
