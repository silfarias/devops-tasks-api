import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

describe('MetricsController', () => {
  let controller: MetricsController;
  let metricsService: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [MetricsService],
    }).compile();

    await module.init();

    controller = module.get<MetricsController>(MetricsController);
    metricsService = module.get<MetricsService>(MetricsService);
  });

  it('should expose prometheus metrics with default and http series', async () => {
    metricsService.httpRequestsTotal.inc({
      method: 'GET',
      route: '/health',
      status_code: '200',
    });

    const response = {
      setHeader: jest.fn(),
      send: jest.fn(),
    };

    await controller.getMetrics(response as never);

    expect(response.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      metricsService.getContentType(),
    );

    expect(response.send).toHaveBeenCalled();
    const calls = response.send.mock.calls as unknown[][];
    const sentPayload = calls[0]?.[0];
    const body = typeof sentPayload === 'string' ? sentPayload : '';
    expect(body).toContain('# HELP');
    expect(body).toContain('process_cpu_user_seconds_total');
    expect(body).toContain('http_requests_total');
    expect(body).toContain('http_request_duration_seconds');
  });
});
