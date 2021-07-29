import { HttpService, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TerraformStateService {
  constructor(
    private readonly configService: ConfigService,
    private httpService: HttpService
  ) {}

  findState(
    stateId: string,
    moduleName: string
  ): Observable<any> {
    return this.httpService
      .get(
        `${this.configService.get<string>(
          'dinivas.api.url'
        )}/terraform/state?stateId=${stateId}&module=${moduleName}`,
        {
          auth: {
            username: this.configService.get<string>(
              'dinivas.terraform.state.username'
            ),
            password: this.configService.get<string>(
              'dinivas.terraform.state.password'
            ),
          },
        }
      )
      .pipe(map((res) => res.data));
  }
}
