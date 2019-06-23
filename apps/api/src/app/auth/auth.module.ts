import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        //PassportModule.register({ defaultStrategy: 'bearer' })
    ],
})
export class AuthModule { }
