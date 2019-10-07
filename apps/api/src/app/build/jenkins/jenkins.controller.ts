import { ConsulService } from './../../network/consul/consul.service';
import { DestroyJenkinsCommand } from './commands/impl/destroy-jenkins.command';
import { ApplyJenkinsCommand } from './commands/impl/apply-jenkins.command';
import { PlanJenkinsCommand } from './commands/impl/plan-jenkins.command';
import { CloudproviderService } from './../../cloudprovider/cloudprovider.service';
import { TerraformStateService } from './../../terraform/terraform-state/terraform-state.service';
import { Permissions } from './../../auth/permissions.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { JenkinsService } from './jenkins.service';
import { AuthzGuard } from './../../auth/authz.guard';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  Controller,
  UseGuards,
  Get,
  Query,
  Param,
  Post,
  Body,
  Delete,
  Req,
  HttpCode,
  Put,
  Logger
} from '@nestjs/common';
import {
  Pagination,
  JenkinsDTO,
  ProjectDTO,
  ApplyModuleDTO,
  ConsulDTO
} from '@dinivas/dto';
import { Request } from 'express';
const YAML = require('js-yaml');

@ApiUseTags('Jenkins')
@Controller('jenkins')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class JenkinsController {
  private readonly logger = new Logger(JenkinsController.name);

  constructor(
    private jenkinsService: JenkinsService,
    private readonly consulService: ConsulService,
    private readonly terraformStateService: TerraformStateService,
    private readonly cloudproviderService: CloudproviderService,
    private readonly commandBus: CommandBus
  ) {}

  @Get()
  @Permissions('jenkins:list')
  async findAll(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'id,desc'
  ): Promise<Pagination<JenkinsDTO>> {
    return this.jenkinsService.findAll({
      page,
      limit,
      sort,
      route: 'http://cats.com/cats'
    });
  }

  @Get(':id')
  @Permissions('jenkins:view')
  async findOne(@Param('id') id: number): Promise<JenkinsDTO> {
    return this.jenkinsService.findOne(id);
  }

  @Post()
  @Permissions('jenkins:create')
  create(
    @Req() request: Request,
    @Body() jenkins: JenkinsDTO
  ): Promise<JenkinsDTO> {
    const project = request['project'] as ProjectDTO;
    jenkins.project = project;
    return this.jenkinsService.create(jenkins);
  }

  @Put(':id')
  @Permissions('jenkins:edit')
  async update(
    @Param('id') id: number,
    @Req() request: Request,
    @Body() jenkins: JenkinsDTO
  ): Promise<JenkinsDTO> {
    this.logger.debug(`Updating jenkins ${jenkins.id} ${jenkins.code}`);
    const project = request['project'] as ProjectDTO;
    jenkins.project = project;
    return await this.jenkinsService.update(id, jenkins);
  }

  @Post('plan')
  @Permissions('jenkins:create')
  async planproject(
    @Req() request: Request,
    @Body() jenkins: JenkinsDTO
  ): Promise<JenkinsDTO> {
    const project = request['project'] as ProjectDTO;
    jenkins.project = project;
    const cloudprovider = await this.cloudproviderService.findOne(
      project.cloud_provider.id, true
    );
    const consul: ConsulDTO = await this.consulService.findOneByCode(
      project.code
    );
    return this.commandBus.execute(
      new PlanJenkinsCommand(jenkins, consul, YAML.safeLoad(cloudprovider.config))
    );
  }

  @Post('apply-plan')
  @HttpCode(202)
  @Permissions('jenkins:create')
  async applyProject(@Body() applyProject: ApplyModuleDTO<JenkinsDTO>) {
    this.commandBus.execute(
      new ApplyJenkinsCommand(applyProject.source, applyProject.workingDir)
    );
  }

  @Get(':id/terraform_state')
  @Permissions('jenkins:view')
  async jenkinsTerraformState(
    @Param('id') id: number,
    @Req() request: Request
  ): Promise<any> {
    const project = request['project'] as ProjectDTO;
    const jenkins = await this.jenkinsService.findOne(id);
    if (jenkins) {
      const state = await this.terraformStateService.findState(
        `${jenkins.code.toLowerCase()}`,
        'jenkins'
      );
      return JSON.parse(state.state);
    }
  }

  @Delete(':id')
  @Permissions('jenkins:delete')
  async remove(@Param('id') id: number, @Req() request: Request) {
    const project = request['project'] as ProjectDTO;
    const jenkins = await this.jenkinsService.findOne(id);
    if (jenkins) {
      const cloudprovider = await this.cloudproviderService.findOne(
        project.cloud_provider.id, true
      );
      const consul: ConsulDTO = await this.consulService.findOneByCode(
        project.code
      );
      this.commandBus.execute(
        new DestroyJenkinsCommand(jenkins, consul, YAML.safeLoad(cloudprovider.config))
      );
    }
  }
}
