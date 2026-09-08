import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', description: 'Estado del servicio' })
  status: string = 'ok';

  @ApiProperty({
    example: 'devops-tasks-api',
    description: 'Nombre del servicio',
  })
  service: string = 'devops-tasks-api';

  @ApiProperty({
    example: '2026-03-24T12:00:00.000Z',
    description: 'Timestamp ISO de la respuesta',
  })
  timestamp: string = new Date().toISOString();
}
