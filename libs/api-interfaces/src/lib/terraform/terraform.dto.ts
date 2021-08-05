import { ConsulDTO } from '../consul/consul.dto';
import { ProjectDTO } from '../project/project.dto';

export interface TerraformStateDTO {
  id: number;
  stateId: string;
  module: string;
  state: string;
  lockId: string;
  lockVersion: string;
  lockOperation: string;
  lockDate: string;
  lockWho: string;
  lockInfo: string;
}

export interface TFChangeRepresentation {
  actions: string[];
  before: TFValuesRepresentation;
  after: TFValuesRepresentation;
}

export interface TFConfigRepresentation {
  provider_configs: any;
  root_module: any;
}

export interface TFStateRepresentation {
  values: TFValuesRepresentation;
  terraform_version: string;
}

export interface TFResource {
  address: string;
  mode: string;
  type: string;
  name: string;
  index: number;
  provider_name: string;
  schema_version: number;
  values: any;
}
export interface TFValueRootModule {
  resources: TFResource[];
}

export interface TFValueChildModule {
  address: string;
  resources: TFResource[];
  child_modules: TFValueChildModule[];
}

export interface TFValuesRepresentation {
  outputs: any;
  name: string;
  root_module: TFValueRootModule;
  child_modules: TFValueChildModule;
}

export interface TFResourceChange {
  address: string;
  module_address: string;
  mode: string;
  type: string;
  name: string;
  index: number;
  deposed: string;
  change: TFChangeRepresentation;
}

export interface TFPlanRepresentation {
  format_version: string;
  prior_state: TFStateRepresentation;
  config: TFConfigRepresentation;
  planned_values: TFValuesRepresentation;
  proposed_unknown: TFValuesRepresentation;
  variables: any;
  resource_changes: TFResourceChange[];
  output_changes: any;
}

// Terraform Event

export interface TerraformModuleEvent<T> {
  source: { data: T; project: ProjectDTO; consul: ConsulDTO };
  planResult?: TFPlanRepresentation;
  stateResult?: TFStateRepresentation;
}
