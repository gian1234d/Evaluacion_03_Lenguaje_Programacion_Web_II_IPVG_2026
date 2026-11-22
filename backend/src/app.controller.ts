import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service.js';

@Controller()
@ApiTags('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Verificar que la API está disponible' })
  @ApiOkResponse({ description: 'API disponible', type: String })
  getHello(): string {
    return this.appService.getHello();
  }
}
