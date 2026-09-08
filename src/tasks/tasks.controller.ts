import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las tareas' })
  @ApiOkResponse({ description: 'Listado de tareas', type: Task, isArray: true })
  findAll(): Task[] {
    return this.tasksService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Crear una tarea' })
  @ApiCreatedResponse({ description: 'Tarea creada', type: Task })
  create(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar el título de una tarea' })
  @ApiParam({ name: 'id', description: 'ID de la tarea', example: 1 })
  @ApiOkResponse({ description: 'Tarea actualizada', type: Task })
  @ApiNotFoundResponse({ description: 'Tarea no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Task {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Marcar una tarea como completada' })
  @ApiParam({ name: 'id', description: 'ID de la tarea', example: 1 })
  @ApiOkResponse({ description: 'Tarea marcada como completada', type: Task })
  @ApiNotFoundResponse({ description: 'Tarea no encontrada' })
  complete(@Param('id', ParseIntPipe) id: number): Task {
    return this.tasksService.complete(id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiParam({ name: 'id', description: 'ID de la tarea', example: 1 })
  @ApiNoContentResponse({ description: 'Tarea eliminada' })
  @ApiNotFoundResponse({ description: 'Tarea no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.tasksService.remove(id);
  }
}
