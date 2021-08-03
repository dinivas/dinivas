import { ApplyProjectHandler } from './apply-project.handler';
import { PlanProjectHandler } from './plan-project.handler';
import { DestroyProjectHandler } from './destroy-project.handler';
export const CommandHandlers = [
  PlanProjectHandler,
  ApplyProjectHandler,
  DestroyProjectHandler,
];

export { PlanProjectHandler, ApplyProjectHandler, DestroyProjectHandler };
