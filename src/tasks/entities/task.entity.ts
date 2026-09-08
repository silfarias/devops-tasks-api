import { ApiProperty } from '@nestjs/swagger';

export class Task {
  @ApiProperty({ example: 1, description: 'Identificador único de la tarea' })
  id: number;

  @ApiProperty({
    example: 'Configurar pipeline CI',
    description: 'Título de la tarea',
  })
  title: string;

  @ApiProperty({ example: false, description: 'Indica si la tarea está completa' })
  completed: boolean;

  @ApiProperty({
    example: '2026-03-24T12:00:00.000Z',
    description: 'Fecha de creación en formato ISO',
  })
  createdAt: string;
}
