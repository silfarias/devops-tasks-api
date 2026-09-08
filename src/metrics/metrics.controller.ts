import { Controller, Get, Header, Res } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { MetricsService } from './metrics.service';

@ApiTags('metrics')
@Controller()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('metrics')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Exponer métricas Prometheus' })
  @ApiProduces('text/plain')
  @ApiOkResponse({
    description: 'Métricas en formato Prometheus text exposition',
    schema: {
      type: 'string',
      example:
        '# HELP http_requests_total Total number of HTTP requests\n# TYPE http_requests_total counter\n',
    },
  })
  async getMetrics(@Res() response: Response): Promise<void> {
    response.setHeader('Content-Type', this.metricsService.getContentType());
    response.send(await this.metricsService.getMetrics());
  }
}
