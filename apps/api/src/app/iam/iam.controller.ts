import { IamService } from './iam.service';
import { AuthzGuard } from '../auth/authz.guard';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, UseGuards, Get, Req, Param } from '@nestjs/common';
import { UserRepresentation } from '@dinivas/dto';

@ApiUseTags('IAM')
@Controller('iam')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Get('members')
  async findAllUsers(@Req() request: Request): Promise<any[]> {
    return this.iamService.findAllUsers();
  }

  @Get('members/:id')
  async findOneUser(@Param('id') id: string): Promise<UserRepresentation> {
    return this.iamService.findOneUser(id);
  }
}
