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

  async findAllState(): Promise<TerraformState[]> {
    return this.stateRepository.find();
  }

  async findState(
    stateId: string,
    moduleName: string
  ): Promise<TerraformState> {
    const state = await this.stateRepository.findOne({
      stateId: stateId,
      module: moduleName
    });
    if (!state) {
      throw new NotFoundException(
        `No state available for state: ${stateId} and module: ${moduleName}`
      );
    }
    return state;
  }

  async getLock(stateId: string, moduleName: string) {
    const state: TerraformState = await this.stateRepository.findOne({
      stateId: stateId,
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

  async lock(stateId: string, moduleName: string, lock: any) {
    let state: TerraformState = await this.stateRepository.findOne({
      stateId: stateId,
      module: moduleName
    });
    if (!state) {
      state = new TerraformState();
      state.stateId = stateId;
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

  async unlock(stateId: string, moduleName: string) {
    let state: TerraformState = await this.stateRepository.findOne({
      stateId: stateId,
      module: moduleName
    });
    if (!state) {
      state = new TerraformState();
      state.stateId = stateId;
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

  async updateState(stateId: string, moduleName: string, newState: any) {
    let state: TerraformState = await this.stateRepository.findOne({
      stateId: stateId,
      module: moduleName
    });
    if (!state) {
      state = new TerraformState();
      state.stateId = stateId;
      state.module = moduleName;
    }
    state.state = newState;
    await this.stateRepository.save(state);
  }
}
