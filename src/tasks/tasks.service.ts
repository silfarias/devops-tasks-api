import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private nextId = 1;

  findAll(): Task[] {
    return this.tasks;
  }

  create(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: this.nextId++,
      title: createTaskDto.title,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.tasks.push(task);
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    const task = this.findOneOrFail(id);
    task.title = updateTaskDto.title;
    return task;
  }

  complete(id: number): Task {
    const task = this.findOneOrFail(id);
    task.completed = true;
    return task;
  }

  remove(id: number): void {
    const index = this.tasks.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    this.tasks.splice(index, 1);
  }

  private findOneOrFail(id: number): Task {
    const task = this.tasks.find((item) => item.id === id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }
}
