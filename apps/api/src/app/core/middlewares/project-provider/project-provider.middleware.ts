import { ProjectsService } from '../../../projects/projects.service';
import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { ProjectDTO, CONSTANT } from '@dinivas/dto';

@Injectable()
export class ProjectProviderMiddleware implements NestMiddleware {
  constructor(private readonly projectsService: ProjectsService) {}

  async use(req: any, res: Response, next: Function) {
    if (req.headers[CONSTANT.HTTP_HEADER_PROJECT_ID.toLowerCase()]) {
      try {
        const projectDTO: ProjectDTO = await this.projectsService.findOne(
          req.headers[CONSTANT.HTTP_HEADER_PROJECT_ID]
        );
        req['project'] = projectDTO;
      } catch (error) {
        if (error instanceof NotFoundException) {
          req.res.header(
            CONSTANT.HTTP_HEADER_PROJECT_UNKNOWN,
            req.headers[CONSTANT.HTTP_HEADER_PROJECT_ID]
          );
          throw error;
        }
      }
    }
    next();
  }
}
