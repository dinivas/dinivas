import { ApplyInstanceHandler } from './apply-instance.handler';
import { PlanInstanceHandler } from './plan-instance.handler';
import { DestroyInstanceHandler } from './destroy-instance.handler';
export const CommandHandlers = [
  PlanInstanceHandler,
  ApplyInstanceHandler,
  DestroyInstanceHandler,
];

export { PlanInstanceHandler, ApplyInstanceHandler, DestroyInstanceHandler };
