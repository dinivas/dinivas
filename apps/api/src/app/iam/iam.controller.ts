import { IamService } from './iam.service';
import { AuthzGuard } from '../auth/authz.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, UseGuards, Get, Req, Param } from '@nestjs/common';
import { UserRepresentation, ProjectDTO } from '@dinivas/api-interfaces';

@ApiTags('IAM')
@Controller('iam')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Get('members')
  async findAllUsers(@Req() request: Request): Promise<any[]> {
    const project = request['project'] as ProjectDTO;
    return this.iamService.findAllUsers(project);
  }

  @Get('members/:id')
  async findOneUser(
    @Req() request: Request,
    @Param('id') id: string
  ): Promise<UserRepresentation> {
    const project = request['project'] as ProjectDTO;
    return this.iamService.findOneUser(project, id);
  }
}
