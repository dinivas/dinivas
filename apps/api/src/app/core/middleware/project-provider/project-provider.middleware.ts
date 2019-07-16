import { ProjectsService } from './../../../projects/projects.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ProjectDTO } from '@dinivas/dto';

@Injectable()
export class ProjectProviderMiddleware implements NestMiddleware {
  constructor(private readonly projectsService: ProjectsService) {}

  async use(req: Request, res: Response, next: Function) {
    if (req.headers['x-dinivas-project-id']) {
      const projectDTO: ProjectDTO = await this.projectsService.findOne(
        req.headers['x-dinivas-project-id']
      );
      req['project'] = projectDTO;
    }
    next();
  }
}
