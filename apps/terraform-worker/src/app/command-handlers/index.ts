import { PlanCommandHandler } from './plan-command.handler';
import { ApplyCommandHandler } from './apply-command.handler';
import { DestroyCommandHandler } from './destroy-command.handler';
export const CommandHandlers = [
  PlanCommandHandler,
  ApplyCommandHandler,
  DestroyCommandHandler,
];

export { PlanCommandHandler, ApplyCommandHandler, DestroyCommandHandler };
