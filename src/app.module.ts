import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsModule } from './metrics/metrics.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule, MetricsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
