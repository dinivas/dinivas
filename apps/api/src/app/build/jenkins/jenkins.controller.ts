import { ConsulService } from './../../network/consul/consul.service';
import { CloudproviderService } from './../../cloudprovider/cloudprovider.service';
import { TerraformStateService } from './../../terraform/terraform-state/terraform-state.service';
import { Permissions } from './../../auth/permissions.decorator';
import { JenkinsService } from './jenkins.service';
import { AuthzGuard } from './../../auth/authz.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
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
  Logger,
} from '@nestjs/common';
import {
  Pagination,
  JenkinsDTO,
  ProjectDTO,
  ApplyModuleDTO,
  ConsulDTO,
  PlanJenkinsCommand,
  ApplyJenkinsCommand,
  DestroyJenkinsCommand,
  BULL_TERRAFORM_MODULE_QUEUE,
} from '@dinivas/api-interfaces';
import { Request } from 'express';
import YAML = require('js-yaml');
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@ApiTags('Jenkins')
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
    @InjectQueue(BULL_TERRAFORM_MODULE_QUEUE)
    private readonly terraformModuleQueue: Queue
  ) {}

  @Get()
  @Permissions('jenkins:list')
  async findAll(
    @Query('page') page = 0,
    @Query('limit') limit = 10,
    @Query('sort') sort = 'id,desc'
  ): Promise<Pagination<JenkinsDTO>> {
    return this.jenkinsService.findAll({
      page,
      limit,
      sort,
      route: 'http://cats.com/cats',
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
  ): Promise<{ planJobId: number | string }> {
    const project = request['project'] as ProjectDTO;
    jenkins.project = project;
    const cloudprovider = await this.cloudproviderService.findOne(
      project.cloud_provider.id,
      true
    );
    const consul: ConsulDTO = await this.consulService.findOneByCode(
      project.code
    );
    const planJob = await this.terraformModuleQueue.add(
      'plan-jenkins',
      new PlanJenkinsCommand(
        cloudprovider.cloud,
        jenkins,
        consul,
        YAML.load(cloudprovider.config, { schema: YAML.FAILSAFE_SCHEMA })
      )
    );
    this.logger.debug(`Plan Job Id with datas: ${JSON.stringify(planJob)}`);
    return { planJobId: planJob.id };
  }

  @Post('apply-plan')
  @HttpCode(202)
  @Permissions('jenkins:create')
  async applyProject(
    @Req() request: Request,
    @Body() applyProject: ApplyModuleDTO<JenkinsDTO>
  ) {
    const project = request['project'] as ProjectDTO;
    applyProject.source.project = project;
    const cloudprovider = await this.cloudproviderService.findOne(
      project.cloud_provider.id,
      true
    );
    const applyJob = await this.terraformModuleQueue.add(
      'apply-jenkins',
      new ApplyJenkinsCommand(
        cloudprovider.cloud,
        applyProject.source,
        applyProject.workingDir
      )
    );
    this.logger.debug('Apply Job Id', JSON.stringify(applyJob));
    return { applyJobId: applyJob.id };
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
      jenkins.project = project;
      const cloudprovider = await this.cloudproviderService.findOne(
        project.cloud_provider.id,
        true
      );
      const consul: ConsulDTO = await this.consulService.findOneByCode(
        project.code
      );
      const destroyJob = await this.terraformModuleQueue.add(
        'destroy-jenkins',
        new DestroyJenkinsCommand(
          cloudprovider.cloud,
          jenkins,
          consul,
          YAML.load(cloudprovider.config, { schema: YAML.FAILSAFE_SCHEMA })
        )
      );
      this.logger.debug(
        `Destroy Job Id with data: ${JSON.stringify(destroyJob)}`
      );
      return { planJobId: destroyJob.id };
    }
  }
}
