import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({
    example: 'Configurar pipeline CI/CD',
    description: 'Nuevo título de la tarea',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
