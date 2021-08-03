import { ApplyJenkinsHandler } from './apply-jenkins.handler';
import { PlanJenkinsHandler } from './plan-jenkins.handler';
import { DestroyJenkinsHandler } from './destroy-jenkins.handler';
export const CommandHandlers = [
  PlanJenkinsHandler,
  ApplyJenkinsHandler,
  DestroyJenkinsHandler,
];

export { PlanJenkinsHandler, ApplyJenkinsHandler, DestroyJenkinsHandler };
