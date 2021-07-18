/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { spawn, exec } from 'child_process';
import { Writable } from 'stream';

interface InteractiveOptions {
  autoApprove?: boolean;
  silent?: boolean;
}

interface DestroyOptions extends InteractiveOptions {}
interface ApplyOptions extends InteractiveOptions {}

interface ExecuteOptions {
  silent?: boolean;
}

interface StdInterface {
  stdout: string;
  stderr: string;
}

interface OutputOptions {
  silent?: boolean;
  simple?: boolean;
}

interface Logger {
  log: (data: string) => Promise<void>;
}

abstract class Base {
  private triggerWordsForInteractiveMode: string[];
  private logger: Logger;
  private stdOutStream: Writable;
  private stdErrStream: Writable;

  constructor(
    private executableName: string,
    private autoApproveOptionName: string
  ) {
    this.triggerWordsForInteractiveMode = [];
    this.logger = {
      log: async (data: string): Promise<void> => {
        console.log(data);
      }
    };
    this.stdErrStream = process.stderr;
    this.stdOutStream = process.stdout;
  }

  public setOutStreams(stdOutStream: Writable, stdErrStream: Writable) {
    this.stdErrStream = stdErrStream;
    this.stdOutStream = stdOutStream;
  }

  public setLogger(logger: Logger) {
    this.logger = logger;
  }

  private async log(data: string, silent: boolean = true) {
    if (!silent) {
      await this.logger.log(data);
    }
  }
  protected async executeSync(
    path: string,
    args: string,
    options: ExecuteOptions,
    env = Object.assign({}, process.env)
  ): Promise<StdInterface> {
    return new Promise<StdInterface>((resolve, reject) => {
      exec(
        `${this.executableName} ${args}`,
        {
          cwd: `${path}`,
          env,
          maxBuffer: 1024 * 1024
        },
        async (err, stdout, stderr) => {
          if (err) {
            await this.log(stderr, options.silent);
            if (stdout) {
              await this.log(stdout, options.silent);
            }
            return reject(err);
          }
          await this.log(stderr, options.silent);
          await this.log(stdout, options.silent);
          return resolve({ stderr, stdout });
        }
      );
    });
  }

  protected parseOutputOptions(input: OutputOptions): OutputOptions {
    const options = {
      silent: true,
      simple: true
    };
    if (typeof input.silent !== 'undefined') {
      options.silent = input.silent;
    }
    if (typeof input.simple !== 'undefined') {
      options.simple = input.simple;
    }
    return options;
  }

  protected addTriggerWordForInteractiveMode(word: string) {
    this.triggerWordsForInteractiveMode.push(word);
  }

  private needsAnswer = (inputData: string) => {
    // TODO rework to iterate through this.triggerWordsForInteractiveMode, to abort early?
    let needsAnswer = false;
    this.triggerWordsForInteractiveMode.forEach(text => {
      if (inputData.includes(text)) {
        needsAnswer = true;
      }
    });
    return needsAnswer;
  };

  private buildArgs = (baseCommand: string, options: ApplyOptions) => {
    const basicArgs = [baseCommand];
    // if (options.autoApprove) {
    //   basicArgs.push(this.autoApproveOptionName);
    // }
    return basicArgs;
  };

  protected executeInteractive(
    baseCommand: string,
    path: string,
    options: InteractiveOptions
  ): Promise<StdInterface> {
    if (options.silent && options.autoApprove === false) {
      return Promise.reject(
        'Silent set to "true" and having autoApprove at "false" is not supported'
      );
    }
    return new Promise<StdInterface>((resolve, reject) => {
      let stdinPiped = false;
      const args = this.buildArgs(baseCommand, options);
      const executable = spawn(this.executableName, args, {
        cwd: `${path}`
      });
      if (!options.silent) {
        executable.stderr.pipe(this.stdErrStream);
        executable.stdout.pipe(this.stdOutStream);
      }

      let aggregatedStdOut = '';
      let aggregatedStdErr = '';

      executable.stdout.on('data', (data: string) => {
        aggregatedStdOut += data;
        if (this.needsAnswer(data)) {
          stdinPiped = true;
          process.stdin.pipe(executable.stdin);
        }
      });
      executable.stderr.on('data', (data: string) => {
        aggregatedStdErr += data;
        if (this.needsAnswer(data)) {
          stdinPiped = true;
          process.stdin.pipe(executable.stdin);
        }
      });

      // on('exit') is always called before onClose, so we do not need on('exit') handler
      // on('error') handler is never called

      executable.on('close', code => {
        if (stdinPiped) {
          process.stdin.unpipe(executable.stdin);
          process.stdin.destroy();
        }
        if (code !== 0) {
          // TODO throw a nice error hier
          return reject();
        }
        if (!options.silent) {
          executable.stderr.unpipe(this.stdErrStream);
          executable.stdout.unpipe(this.stdOutStream);
        }
        return resolve({ stdout: aggregatedStdOut, stderr: aggregatedStdErr });
      });
    });
  }
}

export { Base, ApplyOptions, OutputOptions, DestroyOptions, ExecuteOptions };
