export class HealthResponseDto {
  status: string = 'ok';
  service: string = 'devops-tasks-api';
  timestamp: string = new Date().toISOString();
}
