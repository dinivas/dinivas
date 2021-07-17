import { Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';

export const DEFAULT_YAML_CONFIG_FILENAME = 'config.yaml';
if (!process.env['DINIVAS_CONFIG_FILE']) {
  process.env['DINIVAS_CONFIG_FILE'] =
    __dirname + '/../../../config/default.yml';
}
export const CONFIG_FILE_PATH = process.env['DINIVAS_CONFIG_FILE'];
export default () => {
  const logger = new Logger('ConfigConfiguration');
  logger.debug('Loading config file: ', CONFIG_FILE_PATH);
  return yaml.load(readFileSync(CONFIG_FILE_PATH, 'utf8')) as Record<
    string,
    any
  >;
};
