import { ConsulService } from './../../network/consul/consul.service';
import { CloudproviderService } from './../../cloudprovider/cloudprovider.service';
import { TerraformStateService } from './../../terraform/terraform-state/terraform-state.service';
import { Permissions } from './../../auth/permissions.decorator';
import { GitlabService } from './gitlab.service';
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
  GitlabDTO,
  ProjectDTO,
  ApplyModuleDTO,
  ConsulDTO,
  CommonModuleCommand,
  BULL_TERRAFORM_MODULE_QUEUE,
  CloudProviderId,
} from '@dinivas/api-interfaces';
import { Request } from 'express';
import YAML = require('js-yaml');
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@ApiTags('Gitlab')
@Controller('gitlab')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class GitlabController {
    private readonly logger = new Logger(GitlabController.name);

  constructor(
    private gitlabService: GitlabService,
    private readonly consulService: ConsulService,
    private readonly terraformStateService: TerraformStateService,
    private readonly cloudproviderService: CloudproviderService,
    @InjectQueue(BULL_TERRAFORM_MODULE_QUEUE)
    private readonly terraformModuleQueue: Queue
  ) {}

  @Get()
  @Permissions('gitlab:list')
  async findAll(
    @Query('page') page = 0,
    @Query('limit') limit = 10,
    @Query('sort') sort = 'id,desc'
  ): Promise<Pagination<GitlabDTO>> {
    return this.gitlabService.findAll({
      page,
      limit,
      sort,
      route: 'http://cats.com/cats',
    });
  }

  @Get(':id')
  @Permissions('gitlab:view')
  async findOne(@Param('id') id: number): Promise<GitlabDTO> {
    return this.gitlabService.findOne(id);
  }

  @Post()
  @Permissions('gitlab:create')
  create(
    @Req() request: Request,
    @Body() gitlab: GitlabDTO
  ): Promise<GitlabDTO> {
    const project = request['project'] as ProjectDTO;
    gitlab.project = project;
    return this.gitlabService.create(gitlab);
  }

  @Put(':id')
  @Permissions('gitlab:edit')
  async update(
    @Param('id') id: number,
    @Req() request: Request,
    @Body() gitlab: GitlabDTO
  ): Promise<GitlabDTO> {
    this.logger.debug(`Updating gitlab ${gitlab.id} ${gitlab.code}`);
    const project = request['project'] as ProjectDTO;
    gitlab.project = project;
    return await this.gitlabService.update(id, gitlab);
  }

  @Post('plan')
  @Permissions('gitlab:create')
  async planproject(
    @Req() request: Request,
    @Body() gitlab: GitlabDTO
  ): Promise<{ planJobId: number }> {
    const project = request['project'] as ProjectDTO;
    gitlab.project = project;
    const cloudprovider = await this.cloudproviderService.findOne(
      project.cloud_provider.id,
      true
    );
    const consul: ConsulDTO = await this.consulService.findOneByCode(
      project.code
    );
    const planJob = await this.terraformModuleQueue.add(
      'plan',
      new CommonModuleCommand<GitlabDTO>(
        cloudprovider.cloud as CloudProviderId,
        'gitlab',
        gitlab.code,
        gitlab,
        project.code,
        project,
        consul,
        YAML.load(cloudprovider.config, { schema: YAML.FAILSAFE_SCHEMA })
      )
    );
    this.logger.debug(`Plan Job Id with datas: ${JSON.stringify(planJob)}`);
    return { planJobId: Number(planJob.id) };
  }

  @Post('apply-plan')
  @HttpCode(202)
  @Permissions('gitlab:create')
  async applyProject(
    @Req() request: Request,
    @Body() applyProject: ApplyModuleDTO<GitlabDTO>
  ) {
    const project = request['project'] as ProjectDTO;
    applyProject.source.project = project;
    const cloudprovider = await this.cloudproviderService.findOne(
      project.cloud_provider.id,
      true
    );
    const cloudConfig = YAML.load(cloudprovider.config);
    const consul: ConsulDTO = await this.consulService.findOneByCode(
      project.code
    );
    const applyJob = await this.terraformModuleQueue.add(
      'apply',
      new CommonModuleCommand<GitlabDTO>(
        cloudprovider.cloud as CloudProviderId,
        'gitlab',
        applyProject.source.code,
        applyProject.source,
        project.code,
        project,
        consul,
        cloudConfig
      )
    );
    this.logger.debug(`Apply Job Id ${JSON.stringify(applyJob)}`);
    return { applyJobId: Number(applyJob.id) };
  }

  @Get(':id/terraform_state')
  @Permissions('gitlab:view')
  async gitlabTerraformState(
    @Param('id') id: number,
    @Req() request: Request
  ): Promise<any> {
    const project = request['project'] as ProjectDTO;
    const gitlab = await this.gitlabService.findOne(id);
    if (gitlab) {
      const state = await this.terraformStateService.findState(
        `${gitlab.code.toLowerCase()}`,
        'gitlab'
      );
      return JSON.parse(state.state);
    }
  }

  @Delete(':id')
  @Permissions('gitlab:delete')
  async remove(@Param('id') id: number, @Req() request: Request) {
    const project = request['project'] as ProjectDTO;
    const gitlab = await this.gitlabService.findOne(id);
    if (gitlab) {
      gitlab.project = project;
      const cloudprovider = await this.cloudproviderService.findOne(
        project.cloud_provider.id,
        true
      );
      const consul: ConsulDTO = await this.consulService.findOneByCode(
        project.code
      );
      const destroyJob = await this.terraformModuleQueue.add(
        'destroy',
        new CommonModuleCommand<GitlabDTO>(
          cloudprovider.cloud as CloudProviderId,
          'gitlab',
          gitlab.code,
          gitlab,
          project.code,
          project,
          consul,
          YAML.load(cloudprovider.config, { schema: YAML.FAILSAFE_SCHEMA })
        )
      );
      this.logger.debug(
        `Destroy Job Id with data: ${JSON.stringify(destroyJob)}`
      );
      return { destroyJobId: Number(destroyJob.id) };
    }
  }
}
