import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Configurar pipeline CI',
    description: 'Título de la tarea',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
