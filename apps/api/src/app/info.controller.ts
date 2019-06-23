import { Roles } from './auth/roles.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'apps/api/src/app/auth/roles.guard';

@ApiUseTags('info')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('info')
export class InfoController {
    @Get()
    @Roles('admin')
    apiInfo(): any {
        return {
            serverInfo: 'Serverinfo'
        };
    }
}
