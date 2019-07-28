import { ConfigService } from '../../../core/config/config.service';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class BasicAuthStrategy extends PassportStrategy(BasicStrategy, 'terraform-state-basic') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  validate(username: string, password: string): any {
    if (
      !(
        username === this.configService.get('terraform.state.username') &&
        password === this.configService.get('terraform.state.password')
      )
    ) {
      throw new UnauthorizedException();
    }
    return { username };
  }
}
