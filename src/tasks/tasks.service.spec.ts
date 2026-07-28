import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    service = new TasksService();
  });

  it('should create a task', () => {
    const task = service.create({ title: 'Preparar pipeline CI/CD' });

    expect(task.id).toBe(1);
    expect(task.title).toBe('Preparar pipeline CI/CD');
    expect(task.completed).toBe(false);
    expect(task.createdAt).toBeDefined();
    expect(typeof task.createdAt).toBe('string');
  });

  it('should return all tasks', () => {
    service.create({ title: 'Tarea 1' });
    service.create({ title: 'Tarea 2' });

    const tasks = service.findAll();

    expect(tasks).toHaveLength(2);
    expect(tasks[0].title).toBe('Tarea 1');
    expect(tasks[1].title).toBe('Tarea 2');
  });

  it('should mark a task as completed', () => {
    const created = service.create({ title: 'Completar tarea' });

    const completed = service.complete(created.id);

    expect(completed.completed).toBe(true);
    expect(completed.id).toBe(created.id);
  });

  it('should throw NotFoundException when completing a missing task', () => {
    expect(() => service.complete(999)).toThrow(NotFoundException);
  });

  it('should update a task title', () => {
    const created = service.create({ title: 'Titulo original' });

    const updated = service.update(created.id, { title: 'Titulo editado' });

    expect(updated.title).toBe('Titulo editado');
    expect(updated.id).toBe(created.id);
    expect(updated.completed).toBe(false);
  });

  it('should throw NotFoundException when updating a missing task', () => {
    expect(() => service.update(999, { title: 'No existe' })).toThrow(
      NotFoundException,
    );
  });

  it('should remove a task', () => {
    const created = service.create({ title: 'Para eliminar' });

    service.remove(created.id);

    expect(service.findAll()).toHaveLength(0);
  });

  it('should throw NotFoundException when removing a missing task', () => {
    expect(() => service.remove(999)).toThrow(NotFoundException);
  });
});
