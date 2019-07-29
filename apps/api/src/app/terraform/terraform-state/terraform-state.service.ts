import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TerraformState } from './terraform-state.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TerraformStateService {
  constructor(
    @InjectRepository(TerraformState)
    private readonly stateRepository: Repository<TerraformState>
  ) {}

  async findState(
    projectCode: string,
    moduleName: string
  ): Promise<TerraformState> {
    const state = await this.stateRepository.findOne({
      projectCode: projectCode,
      module: moduleName
    });
    if (!state) {
      throw new NotFoundException(
        `No state available for project: ${projectCode} and module: ${moduleName}`
      );
    }
    return state;
  }

  async getLock(projectCode: string, moduleName: string) {
    const state: TerraformState = await this.stateRepository.findOne({
      projectCode: projectCode,
      module: moduleName
    });
    if (state && state.lockId) {
      return {
        ID: state.lockId,
        Operation: state.lockOperation,
        Info: state.lockInfo,
        Who: state.lockWho,
        Version: state.lockVersion,
        Created: state.lockDate
      };
    }
    return undefined;
  }

  async lock(projectCode: string, moduleName: string, lock: any) {
    let state: TerraformState = await this.stateRepository.findOne({
      projectCode: projectCode,
      module: moduleName
    });
    if (!state) {
      state = new TerraformState();
      state.projectCode = projectCode;
      state.module = moduleName;
      //state.state = '{}';
    }
    state.lockId = lock.ID;
    state.lockVersion = lock.Version;
    state.lockOperation = lock.Operation;
    state.lockInfo = lock.Info;
    state.lockWho = lock.Who;
    state.lockDate = lock.Created;
    await this.stateRepository.save(state);
  }

  async unlock(projectCode: string, moduleName: string) {
    let state: TerraformState = await this.stateRepository.findOne({
      projectCode: projectCode,
      module: moduleName
    });
    if (!state) {
      state = new TerraformState();
      state.projectCode = projectCode;
      state.module = moduleName;
    }
    state.lockId = null;
    state.lockVersion = null;
    state.lockOperation = null;
    state.lockInfo = null;
    state.lockWho = null;
    state.lockDate = null;
    await this.stateRepository.save(state);
  }

  async updateState(projectCode: string, moduleName: string, newState: any) {
    let state: TerraformState = await this.stateRepository.findOne({
      projectCode: projectCode,
      module: moduleName
    });
    if (!state) {
      state = new TerraformState();
      state.projectCode = projectCode;
      state.module = moduleName;
    }
    state.state = newState;
    await this.stateRepository.save(state);
  }
}
