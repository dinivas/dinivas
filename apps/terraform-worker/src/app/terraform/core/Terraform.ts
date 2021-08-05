/* eslint-disable no-async-promise-executor */
import { MinioService } from './../minio.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigurationService } from '../../configuration.service';
import {
  Base,
  ApplyOptions,
  OutputOptions,
  DestroyOptions,
  ExecuteOptions,
} from './base';
import {
  SimpleOutputObject,
  OutputObject,
  TerraformMultipleOutput,
  TerraformSingleOutput,
  SimpleOutput,
  Output,
  ResourceCounts,
  ChangeTypes,
} from './types';
import {
  TFPlanRepresentation,
  TFStateRepresentation,
  ProjectDTO,
  ConsulDTO,
  TerraformModule,
  CloudProviderId,
} from '@dinivas/api-interfaces';
import fs = require('fs');
import * as archiver from 'archiver';
import path = require('path');
import os = require('os');
import * as extract from 'extract-zip';
import { computeTerraformModuleTemplateContextForDigitalocean } from '../digitalocean';
import { computeTerraformModuleTemplateContextForOpenstack } from '../openstack';
import Handlebars = require('handlebars');
import { Job } from 'bull';

@Injectable()
export class Terraform extends Base {
  private readonly nestLogger = new Logger(Terraform.name);
  constructor(
    private configService: ConfigurationService,
    private minioService: MinioService
  ) {
    super(
      configService.getTerraformExecutable(),
      '-auto-approve',
      new Logger('Terraform Execution')
    );
    this.addTriggerWordForInteractiveMode(
      "Only 'yes' will be accepted to approve"
    );
    this.addTriggerWordForInteractiveMode(
      "Only 'yes' will be accepted to confirm"
    );
  }
  public async init(
    path: string,
    commandLineArgs: string[],
    options: ExecuteOptions = { silent: true }
  ) {
    const commandToExecute = `init ${commandLineArgs.join(' ')}`;
    this.nestLogger.debug(commandToExecute);
    await this.executeSync(path, commandToExecute, {
      silent: options.silent,
    });
  }

  public async output(
    path: string,
    options: OutputOptions = {}
  ): Promise<SimpleOutputObject | OutputObject> {
    const parsedOptions = this.parseOutputOptions(options);
    const { stdout } = await this.executeSync(path, 'output -json', {
      silent: parsedOptions.silent,
    });
    const output = <TerraformMultipleOutput>JSON.parse(stdout);
    if (options.simple) {
      const keys = Object.keys(output);
      const result = {};
      keys.forEach((key) => {
        result[key] = output[key].value;
      });
      return result;
    }
    return output;
  }

  public async outputValue(
    path: string,
    value: string,
    options: OutputOptions = {}
  ): Promise<SimpleOutput | Output> {
    const parsedOptions = this.parseOutputOptions(options);
    const { stdout } = await this.executeSync(path, `output -json ${value}`, {
      silent: parsedOptions.silent,
    });
    const output = <TerraformSingleOutput>JSON.parse(stdout);
    if (parsedOptions.simple) {
      return output.value;
    }
    return output;
  }

  public async getOutputKeys(
    path: string,
    options: ExecuteOptions = {}
  ): Promise<string[]> {
    const { stdout } = await this.executeSync(path, 'output -json', {
      silent: options.silent || true,
    });
    const output = JSON.parse(stdout);
    return Object.keys(output);
  }

  public async plan(
    directoryPath: string,
    commandLineArgs: string[],
    options: ExecuteOptions = {},
    bucketName: string,
    tfPlanFileName: string
  ): Promise<TFPlanRepresentation> {
    const commandToExecute = `plan -input=false ${commandLineArgs.join(' ')}`;
    this.nestLogger.debug(commandToExecute);
    // First plan and save in file tfplan
    await this.executeSync(directoryPath, commandToExecute, {
      silent: options.silent || false,
    });
    const { stdout } = await this.executeSync(
      directoryPath,
      `show -json tfplan`,
      {
        silent: true,
      }
    );
    return new Promise<TFPlanRepresentation>((resolve, reject) => {
      const zipFilePath = path.join(
        fs.mkdtempSync(os.tmpdir()),
        'workspace.zip'
      );
      // Archive the workspace
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 }, // Sets the compression level.
      });
      // listen for all archive data to be written
      // 'close' event is fired only when a file descriptor is involved
      output.on('close', async () => {
        this.nestLogger.debug(archive.pointer() + ' total bytes');
        this.nestLogger.debug(
          'archiver has been finalized and the output file descriptor has closed.'
        );
        // Upload workspace archive to Minio
        await this.minioService.doInBucket(
          bucketName,
          (minio, minioResolve, minioReject) => {
            minio.fPutObject(
              bucketName,
              `${tfPlanFileName}/workspace.zip`,
              zipFilePath,
              { 'Content-Type': 'application/zip' },
              (err, objInfo) => {
                if (err) {
                  minioReject(err);
                }
                this.nestLogger.debug(
                  `Upload workspace zip file [${zipFilePath}] to bucket ${bucketName} Success ${objInfo}`
                );
                minioResolve();
              }
            );
          }
        );
        resolve(JSON.parse(stdout) as TFPlanRepresentation);
      });

      // This event is fired when the data source is drained no matter what was the data source.
      // It is not part of this library but rather from the NodeJS Stream API.
      // @see: https://nodejs.org/api/stream.html#stream_event_end
      output.on('end', function () {
        console.log('Data has been drained');
      });

      // good practice to catch warnings (ie stat failures and other non-blocking errors)
      archive.on('warning', function (err) {
        if (err.code === 'ENOENT') {
          // log warning
        } else {
          // throw error
          reject(err);
        }
      });

      // good practice to catch this error explicitly
      archive.on('error', function (err) {
        reject(err);
      });
      // archive.on('entry', (entryData) => {
      //   this.nestLogger.verbose(`Adding entry ${entryData.name} to Zip file [${zipFilePath}]...`);
      // });
      archive.pipe(output);
      this.nestLogger.debug(
        `Zipping workspace directory: ${directoryPath} to ${zipFilePath}...`
      );
      archive.directory(`${directoryPath}/`, false);
      archive.finalize();
    });
  }

  public async destroy(
    job: Job,
    commandLineArgs: string[],
    options: DestroyOptions = {},
    bucketName: string,
    tfPlanFileName: string
  ) {
    const commandToExecute = `destroy -input=false ${commandLineArgs.join(
      ' '
    )}`;
    this.nestLogger.debug(
      `Terraform Destroy command to execute: ${commandToExecute}`
    );
    const workingDirectory = fs.mkdtempSync(os.tmpdir());
    // Download last workspace from Minio
    const zipFilePath = path.join(fs.mkdtempSync(os.tmpdir()), 'workspace.zip');
    await this.minioService.doInBucket(bucketName, (minio, resolve, reject) => {
      minio.fGetObject(
        bucketName,
        `${tfPlanFileName}/workspace.zip`,
        zipFilePath,
        (err) => {
          if (err) {
            reject(err);
          }
          this.nestLogger.debug(
            `Downloaded workspace file [${tfPlanFileName}/workspace.zip] from bucket ${bucketName} Success in ${zipFilePath}`
          );
          resolve();
        }
      );
    });
    job.progress(30);
    await extract(zipFilePath, { dir: workingDirectory });
    job.progress(50);
    this.nestLogger.debug(
      `Extracted workspace [${zipFilePath}] to directory: ${workingDirectory}`
    );
    this.nestLogger.debug(
      `Terraform destroy with following parameters: Workdir: [${workingDirectory}], LocalZipFile: [${zipFilePath}]`
    );
    await this.executeSync(workingDirectory, commandToExecute, {
      silent: options.silent || false,
    });
    job.progress(90);
    return;
  }

  public async apply(
    job: Job<any>,
    commandLineArgs: string[],
    options: ApplyOptions = {},
    bucketName: string,
    tfPlanFileName: string
  ): Promise<TFStateRepresentation> {
    const commandToExecute = `apply -input=false ${commandLineArgs.join(' ')}`;
    this.nestLogger.debug(
      `Terraform Apply command to execute: ${commandToExecute}`
    );
    const workingDirectory = fs.mkdtempSync(os.tmpdir());
    // Download last workspace from Minio
    const zipFilePath = path.join(fs.mkdtempSync(os.tmpdir()), 'workspace.zip');
    await this.minioService.doInBucket(bucketName, (minio, resolve, reject) => {
      minio.fGetObject(
        bucketName,
        `${tfPlanFileName}/workspace.zip`,
        zipFilePath,
        (err) => {
          if (err) {
            reject(err);
          }
          this.nestLogger.debug(
            `Downloaded workspace file [${tfPlanFileName}/workspace.zip] from bucket ${bucketName} Success in ${zipFilePath}`
          );
          resolve();
        }
      );
    });
    job.progress(30);
    await extract(zipFilePath, { dir: workingDirectory });
    job.progress(50);
    this.nestLogger.debug(
      `Extracted workspace [${zipFilePath}] to directory: ${workingDirectory}`
    );
    this.nestLogger.debug(
      `Terraform apply with following parameters: Workdir: [${workingDirectory}], LocalZipFile: [${zipFilePath}]`
    );
    // Terraform apply
    await this.executeSync(workingDirectory, commandToExecute, {
      silent: options.silent || false,
    });
    job.progress(80);
    // Terraform show state as json
    const { stdout } = await this.executeSync(workingDirectory, `show -json`, {
      silent: true,
    });
    job.progress(90);
    return JSON.parse(stdout) as TFStateRepresentation;
  }

  private parseResourceChanges(
    rawStringWithResourceChanges: string,
    command: ChangeTypes
  ): ResourceCounts {
    if (rawStringWithResourceChanges.includes('No changes')) {
      return {
        addCount: 0,
        changeCount: 0,
        destroyCount: 0,
      };
    }
    let regexp = / /;
    switch (command) {
      case ChangeTypes.PLAN:
        regexp = new RegExp(
          'Plan: (\\d*) to add, (\\d*) to change, (\\d*) to destroy',
          'gi'
        );
        break;
      case ChangeTypes.ADDED:
        regexp = new RegExp(
          'Apply complete! Resources: (\\d*) added, (\\d*) changed, (\\d*) destroyed',
          'gi'
        );
        break;
      case ChangeTypes.DESTROYED:
        regexp = new RegExp('Destroy complete! Resources: (\\d) destroyed');
        break;
    }
    const resourcesChangesWithoutStyles = rawStringWithResourceChanges.replace(
      // eslint-disable-next-line no-control-regex
      /\u001b\[.*?m/g,
      ''
    );
    const matches = regexp.exec(resourcesChangesWithoutStyles);

    if (matches) {
      if (command === ChangeTypes.DESTROYED) {
        return {
          addCount: 0,
          changeCount: 0,
          destroyCount: parseInt(matches[1], 10),
        };
      }
      return {
        addCount: parseInt(matches[1], 10),
        changeCount: parseInt(matches[2], 10),
        destroyCount: parseInt(matches[3], 10),
      };
    }
    throw new Error(
      `Could not extract added, changed and destroyed count with regexp ${regexp} from command ${rawStringWithResourceChanges}`
    );
  }

  addBackendConfigFileToModule(
    cloudProviderId: string,
    stateId: string,
    module: string,
    destination: string
  ) {
    try {
      fs.writeFileSync(
        path.join(destination, 'backend.tf'),
        this.renderTemplate(`${cloudProviderId}/backend.hbs`, {
          min_required_version: this.configService.get(
            'terraform.min_required_version'
          ),
          http_address: this.configService.get('terraform.state.http_address'),
          username: this.configService.get('terraform.state.username'),
          password: this.configService.get('terraform.state.password'),
          state_id: stateId.toLowerCase(),
          module: module.toLowerCase(),
        })
      );
    } catch (err) {
      console.error(err);
    }
  }

  addProviderConfigFileToModule(
    cloudprovider: string,
    cloudConfig: any,
    destination: string
  ) {
    let providerContext;
    if ('openstack' === cloudprovider) {
      providerContext = {
        user_name: cloudConfig.clouds.openstack.auth.username,
        tenant_name: cloudConfig.clouds.openstack.auth.project_name,
        password: cloudConfig.clouds.openstack.auth.password,
        auth_url: cloudConfig.clouds.openstack.auth.auth_url,
        region: cloudConfig.clouds.openstack.region_name,
      };
    }
    if ('digitalocean' === cloudprovider) {
      providerContext = { access_token: cloudConfig.access_token };
    }
    try {
      fs.writeFileSync(
        path.join(destination, 'provider.tf'),
        this.renderTemplate(`${cloudprovider}/provider.hbs`, providerContext)
      );
    } catch (err) {
      this.nestLogger.error(err);
    }
  }

  addKeycloakProviderConfigFileToModule(
    project: ProjectDTO,
    destination: string
  ) {
    try {
      fs.writeFileSync(
        path.join(destination, 'keycloak-provider.tf'),
        this.renderTemplate(
          `${project.cloud_provider.cloud}/keycloak-provider.hbs`,
          {
            keycloak_host: project.keycloak_host,
            keycloak_client_id: project.keycloak_client_id,
            keycloak_client_secret: project.keycloak_client_secret,
          }
        )
      );
    } catch (err) {
      this.nestLogger.error(err);
    }
  }

  renderTemplate(templatePath: string, templateContext: any): string {
    const templateStr = fs
      .readFileSync(
        path.resolve(__dirname, 'assets', 'templates', templatePath)
      )
      .toString('utf8');
    const template = Handlebars.compile(templateStr, { noEscape: true });
    return template(templateContext);
  }

  executeInTerraformModuleDir(
    projectCode: string,
    cloudProviderId: string,
    tfModuleName: string,
    cloudConfig,
    preInitCallback?: (workingFolder: string) => void,
    postInitCallback?: (workingFolder: string) => void,
    onInitErrorCallback?: (error) => void
  ) {
    fs.mkdtemp(
      path.join(
        os.tmpdir(),
        `project-${projectCode.toLocaleLowerCase()}-${tfModuleName}-`
      ),
      async (err: any, tempFolder: string) => {
        if (err) throw err;
        this.nestLogger.debug(`Working Terraform folder: ${tempFolder}`);
        // Add backend config file
        this.addBackendConfigFileToModule(
          cloudProviderId,
          projectCode,
          tfModuleName,
          tempFolder
        );
        // Add provider config
        this.addProviderConfigFileToModule(
          cloudProviderId,
          cloudConfig,
          tempFolder
        );
        if (preInitCallback) preInitCallback(tempFolder);
        // Init module temporary directory
        try {
          await this.init(tempFolder, [], {
            silent: !this.configService.getOrElse(
              'terraform.init.verbose',
              false
            ),
          });
          if (postInitCallback) postInitCallback(tempFolder);
        } catch (error) {
          if (onInitErrorCallback) onInitErrorCallback(error);
        }
      }
    );
  }

  addTerraformModuleFile(
    moduleId: TerraformModule,
    cloudprovider: CloudProviderId,
    moduleData: any,
    projectConsul: ConsulDTO,
    cloudConfig: any,
    destination: string
  ) {
    try {
      fs.writeFileSync(
        path.join(destination, 'main.tf'),
        this.renderTemplate(
          `${cloudprovider}/${moduleId}.hbs`,
          this.computeTerraformModuleTemplateContext(
            moduleId,
            cloudprovider,
            moduleData,
            projectConsul,
            cloudConfig
          )
        )
      );
    } catch (err) {
      this.nestLogger.error(err);
    }
  }

  computeTerraformModuleTemplateContext(
    moduleId: TerraformModule,
    cloudprovider: CloudProviderId,
    moduleData: any,
    projectConsul: ConsulDTO,
    cloudConfig: any
  ): any {
    if ('openstack' === cloudprovider) {
      return computeTerraformModuleTemplateContextForOpenstack(
        moduleId,
        cloudprovider,
        moduleData,
        projectConsul,
        cloudConfig,
        this.configService.getTerraformModuleSource(moduleId, 'openstack')
      );
    }
    if ('digitalocean' === cloudprovider) {
      return computeTerraformModuleTemplateContextForDigitalocean(
        moduleId,
        cloudprovider,
        moduleData,
        projectConsul,
        cloudConfig,
        this.configService.getTerraformModuleSource(moduleId, 'digitalocean')
      );
    }
  }

  addSshViaBastionConfigFileToModule(
    cloudProviderId: string,
    projectState: any,
    destination: string
  ) {
    try {
      fs.writeFileSync(
        path.join(destination, 'ssh-via-bastion.tfvars'),
        this.renderTemplate(`${cloudProviderId}/ssh-via-bastion.hbs`, {
          project_private_key: projectState.outputs.project_private_key.value,
          bastion_private_key: projectState.outputs.bastion_private_key.value,
          bastion_host: projectState.outputs.bastion_floating_ip.value,
        })
      );
    } catch (err) {
      this.nestLogger.error(err);
    }
  }
}
