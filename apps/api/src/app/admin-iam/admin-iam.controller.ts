import { AdminIamService } from './admin-iam.service';
import { AuthzGuard } from '../auth/authz.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, UseGuards, Get, Req, Param } from '@nestjs/common';
import { UserRepresentation } from '@dinivas/api-interfaces';

@ApiTags('IAM')
@Controller('admin-iam')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class AdminIamController {
  constructor(private readonly adminIamService: AdminIamService) {}

  @Get('members')
  async findAllUsers(@Req() request: Request): Promise<any[]> {
    return this.adminIamService.findAllUsers();
  }

  @Get('members/:id')
  async findOneUser(@Param('id') id: string): Promise<UserRepresentation> {
    return this.adminIamService.findOneUser(id);
  }
}
