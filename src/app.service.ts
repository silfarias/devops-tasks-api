import { Injectable } from '@nestjs/common';
import { HealthResponseDto } from './dtos/health-response.dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealth(): HealthResponseDto {
    return new HealthResponseDto();
  }
}
