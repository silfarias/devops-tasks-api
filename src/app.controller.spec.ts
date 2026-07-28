import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return Hello World', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('health', () => {
    it('should return service health status', () => {
      const response = appController.getHealth();

      expect(response.status).toBe('ok');
      expect(response.service).toBe('devops-tasks-api');
      expect(response.timestamp).toBeDefined();
      expect(typeof response.timestamp).toBe('string');
      expect(Number.isNaN(Date.parse(response.timestamp))).toBe(false);
    });
  });
});
