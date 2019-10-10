import { ConsulService } from '../../network/consul/consul.service';
import { DestroyRabbitMQCommand } from './commands/impl/destroy-rabbitmq.command';
import { ApplyRabbitMQCommand } from './commands/impl/apply-rabbitmq.command';
import { PlanRabbitMQCommand } from './commands/impl/plan-rabbitmq.command';
import { CloudproviderService } from '../../cloudprovider/cloudprovider.service';
import { TerraformStateService } from '../../terraform/terraform-state/terraform-state.service';
import { Permissions } from '../../auth/permissions.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { RabbitMQService } from './rabbitmq.service';
import { AuthzGuard } from '../../auth/authz.guard';
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
  RabbitMQDTO,
  ProjectDTO,
  ApplyModuleDTO,
  ConsulDTO
} from '@dinivas/dto';
import { Request } from 'express';
const YAML = require('js-yaml');

@ApiUseTags('RabbitMQ')
@Controller('rabbitmq')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
export class RabbitMQController {
  private readonly logger = new Logger(RabbitMQController.name);

  constructor(
    private rabbitmqService: RabbitMQService,
    private readonly consulService: ConsulService,
    private readonly terraformStateService: TerraformStateService,
    private readonly cloudproviderService: CloudproviderService,
    private readonly commandBus: CommandBus
  ) {}

  @Get()
  @Permissions('rabbitmq:list')
  async findAll(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'id,desc'
  ): Promise<Pagination<RabbitMQDTO>> {
    return this.rabbitmqService.findAll({
      page,
      limit,
      sort,
      route: 'http://cats.com/cats'
    });
  }

  @Get(':id')
  @Permissions('rabbitmq:view')
  async findOne(@Param('id') id: number): Promise<RabbitMQDTO> {
    return this.rabbitmqService.findOne(id);
  }

  @Post()
  @Permissions('rabbitmq:create')
  create(
    @Req() request: Request,
    @Body() rabbitmq: RabbitMQDTO
  ): Promise<RabbitMQDTO> {
    const project = request['project'] as ProjectDTO;
    rabbitmq.project = project;
    return this.rabbitmqService.create(rabbitmq);
  }

  @Put(':id')
  @Permissions('rabbitmq:edit')
  async update(
    @Param('id') id: number,
    @Req() request: Request,
    @Body() rabbitmq: RabbitMQDTO
  ): Promise<RabbitMQDTO> {
    this.logger.debug(`Updating rabbitmq ${rabbitmq.id} ${rabbitmq.code}`);
    const project = request['project'] as ProjectDTO;
    rabbitmq.project = project;
    return await this.rabbitmqService.update(id, rabbitmq);
  }

  @Post('plan')
  @Permissions('rabbitmq:create')
  async planproject(
    @Req() request: Request,
    @Body() rabbitmq: RabbitMQDTO
  ): Promise<RabbitMQDTO> {
    const project = request['project'] as ProjectDTO;
    rabbitmq.project = project;
    const cloudprovider = await this.cloudproviderService.findOne(
      project.cloud_provider.id, true
    );
    const consul: ConsulDTO = await this.consulService.findOneByCode(
      project.code
    );
    return this.commandBus.execute(
      new PlanRabbitMQCommand(rabbitmq, consul, YAML.safeLoad(cloudprovider.config))
    );
  }

  @Post('apply-plan')
  @HttpCode(202)
  @Permissions('rabbitmq:create')
  async applyProject(@Body() applyProject: ApplyModuleDTO<RabbitMQDTO>) {
    this.commandBus.execute(
      new ApplyRabbitMQCommand(applyProject.source, applyProject.workingDir)
    );
  }

  @Get(':id/terraform_state')
  @Permissions('rabbitmq:view')
  async rabbitmqTerraformState(
    @Param('id') id: number,
    @Req() request: Request
  ): Promise<any> {
    const project = request['project'] as ProjectDTO;
    const rabbitmq = await this.rabbitmqService.findOne(id);
    if (rabbitmq) {
      const state = await this.terraformStateService.findState(
        `${rabbitmq.code.toLowerCase()}`,
        'rabbitmq'
      );
      return JSON.parse(state.state);
    }
  }

  @Delete(':id')
  @Permissions('rabbitmq:delete')
  async remove(@Param('id') id: number, @Req() request: Request) {
    const project = request['project'] as ProjectDTO;
    const rabbitmq = await this.rabbitmqService.findOne(id);
    if (rabbitmq) {
      const cloudprovider = await this.cloudproviderService.findOne(
        project.cloud_provider.id, true
      );
      const consul: ConsulDTO = await this.consulService.findOneByCode(
        project.code
      );
      this.commandBus.execute(
        new DestroyRabbitMQCommand(rabbitmq, consul, YAML.safeLoad(cloudprovider.config))
      );
    }
  }
}
