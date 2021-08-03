import { ApplyConsulHandler } from './apply-consul.handler';
import { PlanConsulHandler } from './plan-consul.handler';
import { DestroyConsulHandler } from './destroy-consul.handler';
export const CommandHandlers = [
  PlanConsulHandler,
  ApplyConsulHandler,
  DestroyConsulHandler,
];
export { PlanConsulHandler, ApplyConsulHandler, DestroyConsulHandler };
