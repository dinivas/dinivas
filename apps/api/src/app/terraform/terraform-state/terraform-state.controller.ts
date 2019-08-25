import { AuthzGuard } from './../../auth/authz.guard';
import { TerraformState } from './terraform-state.entity';
import { Permissions } from './../../auth/permissions.decorator';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { TerraformStateService } from './terraform-state.service';
import {
  Controller,
  Get,
  Post,
  Delete,
  All,
  Req,
  Logger,
  Query,
  Res,
  UseGuards
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@ApiUseTags('Projects')
@Controller('terraform/state')
export class TerraformStateController {
  private readonly logger = new Logger(TerraformStateController.name);

  constructor(private readonly stateService: TerraformStateService) {}

  @Get()
  @UseGuards(AuthGuard('terraform-state-basic'))
  async getState(
    @Query('stateId') stateId: string,
    @Query('module') moduleName: string
  ): Promise<any> {
    this.logger.debug(
      `Receive get state query with params: stateId=${stateId}, module=${moduleName}`
    );
    const state = await this.stateService.findState(stateId, moduleName);
    return JSON.parse(state.state);
  }

  @Get('all')
  @ApiBearerAuth()
  @UseGuards(AuthzGuard)
  @Permissions('terraform.state:list')
  async getAllState(): Promise<TerraformState[]> {
    return this.stateService.findAllState();
  }

  @Post()
  @UseGuards(AuthGuard('terraform-state-basic'))
  async updateState(
    @Req() request: Request,
    @Res() response: Response,
    @Query('stateId') stateId: string,
    @Query('module') moduleName: string
  ): Promise<any> {
    this.logger.debug(
      `Receive update state query with params: stateId=${stateId}, module=${moduleName}`
    );
    const lockId = request.query.ID;
    if (lockId) {
      this.logger.debug(`received update request for lock ${lockId}`);
    } else {
      this.logger.debug(`received update request`);
    }

    this.logger.debug(`checking for existing lock`);
    const existingLock = await this.stateService.getLock(
      stateId,
      moduleName
    );

    if (existingLock) {
      if (lockId !== existingLock.ID) {
        this.logger.debug(`incoming lock id does not match existing lock`);
        response
          .status(423)
          .send(existingLock)
          .end();

        return;
      }
    } else if (lockId) {
      this.logger.debug(`receiving locked request but state is not locked`);

      response
        .status(400)
        .send(`state is not locked, but you included a lock id in your request`)
        .end();

      return;
    }

    // Update state
    await this.stateService.updateState(stateId, moduleName, request.body);

    // Send success
    response.status(200).end();
  }

  @Delete()
  @UseGuards(AuthGuard('terraform-state-basic'))
  deleteState(
    @Req() request: Request,
    @Query('stateId') stateId: string,
    @Query('module') moduleName: string
  ): Promise<any> {
    this.logger.debug(
      `Receive delete state query with params: stateId=${stateId}, module=${moduleName}`
    );
    return null;
  }

  @All() // order is important for this method. We need to handle Http LOCK & UNLOCK but NestJs does not provide it yet
  @UseGuards(AuthGuard('terraform-state-basic'))
  async lockOrUnlockState(
    @Query('stateId') stateId: string,
    @Query('module') module: string,
    @Req() request: Request,
    @Res() response: Response
  ) {
    // Decide if need lock or unlock
    if (request.method === 'LOCK') {
      this.logger.debug(
        `Receive lock query for state: ${stateId} and module: ${module}`
      );
      const existingLock = await this.stateService.getLock(stateId, module);
      if (existingLock) {
        this.logger.debug(`existing lock ${existingLock.ID} found`);
        response
          .status(409)
          .send(existingLock)
          .end();
        return;
      }
      this.logger.debug(
        `no lock found for state: ${stateId} and module: ${module}`
      );
      // Lock it
      const newLock = request.body;
      this.logger.debug(
        `locking state: ${stateId} and module: ${module} with ${
          newLock.ID
        }`
      );
      await await this.stateService.lock(stateId, module, newLock);
      this.logger.debug(
        `locked state: ${stateId} and module: ${module} with ${
          newLock.ID
        }`
      );
      // Send success
      response.status(200).end();
    } else if (request.method === 'UNLOCK') {
      this.logger.debug(
        `Receive unlock query for state: ${stateId} and module: ${module}`
      );
      const existingLock = await this.stateService.getLock(stateId, module);
      if (!existingLock) {
        this.logger.debug(
          `no existing lock found for state: ${stateId} and module: ${module}, already unlocked`
        );
        response.status(409).end();
        return;
      }
      if (request.body.ID && existingLock.ID !== request.body.ID) {
        this.logger.debug(
          `incoming lock id ${request.body.id} does not match current lock ${
            existingLock.ID
          }`
        );
        response
          .status(423)
          .send(existingLock)
          .end();

        return;
      }

      this.logger.debug(`unlocking`);
      // Unlock it
      await this.stateService.unlock(stateId, module);

      this.logger.debug(`unlocked`);
      // Send success
      response.status(200).end();
    }
  }
}
