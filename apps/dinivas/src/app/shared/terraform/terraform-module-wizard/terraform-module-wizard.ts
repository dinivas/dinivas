import { Type } from '@angular/core';
import {
  GitlabDTO,
  JenkinsDTO,
  InstanceDTO,
  ConsulDTO,
  RabbitMQDTO,
} from '@dinivas/api-interfaces';

export type TerraformModuleType =
  | GitlabDTO
  | JenkinsDTO
  | InstanceDTO
  | ConsulDTO
  | RabbitMQDTO;

export class TerraformModuleWizard<T extends TerraformModuleType> {
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
