import { ApiUseTags } from '@nestjs/swagger';
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
@UseGuards(AuthGuard('terraform-state-basic'))
export class TerraformStateController {
  private readonly logger = new Logger(TerraformStateController.name);

  constructor(private readonly stateService: TerraformStateService) {}

  @Get()
  async getState(
    @Query('projectCode') projectCode: string,
    @Query('module') moduleName: string
  ): Promise<any> {
    this.logger.debug(
      `Receive get state query with params: projectCode=${projectCode}, module=${moduleName}`
    );
    const state = await this.stateService.findState(projectCode, moduleName);
    return JSON.parse(state.state);
  }

  @Post()
  async updateState(
    @Req() request: Request,
    @Res() response: Response,
    @Query('projectCode') projectCode: string,
    @Query('module') moduleName: string
  ): Promise<any> {
    this.logger.debug(
      `Receive update state query with params: projectCode=${projectCode}, module=${moduleName}`
    );
    const lockId = request.query.ID;
    if (lockId) {
      this.logger.debug(`received update request for lock ${lockId}`);
    } else {
      this.logger.debug(`received update request`);
    }

    this.logger.debug(`checking for existing lock`);
    const existingLock = await this.stateService.getLock(
      projectCode,
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
    await this.stateService.updateState(projectCode, moduleName, request.body);

    // Send success
    response.status(200).end();
  }

  @Delete()
  deleteState(
    @Req() request: Request,
    @Query('projectCode') projectCode: string,
    @Query('module') moduleName: string
  ): Promise<any> {
    this.logger.debug(
      `Receive delete state query with params: projectCode=${projectCode}, module=${moduleName}`
    );
    return null;
  }

  @All()
  async lockOrUnlockState(
    @Query('projectCode') projectCode: string,
    @Query('module') module: string,
    @Req() request: Request,
    @Res() response: Response
  ) {
    // Decide if need lock or unlock
    if (request.method === 'LOCK') {
      this.logger.debug(`Receive lock query`);
      const existingLock = await this.stateService.getLock(projectCode, module);
      if (existingLock) {
        this.logger.debug(`existing lock ${existingLock.ID} found`);
        response
          .status(409)
          .send(existingLock)
          .end();
        return;
      }
      this.logger.debug(`no lock found`);
      // Lock it
      const newLock = request.body;
      this.logger.debug(`locking with ${newLock.ID}`);
      await await this.stateService.lock(projectCode, module, newLock);
      this.logger.debug(`locked with ${newLock.ID}`);
      // Send success
      response.status(200).end();
    } else if (request.method === 'UNLOCK') {
      this.logger.debug(`Receive unlock query`);
      const existingLock = await this.stateService.getLock(projectCode, module);
      if (!existingLock) {
        this.logger.debug(`no existing lock found, already unlocked`);
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
      await this.stateService.unlock(projectCode, module);

      this.logger.debug(`unlocked`);
      // Send success
      response.status(200).end();
    }
  }
}
