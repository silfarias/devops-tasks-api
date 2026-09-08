import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    if (this.shouldSkip(request)) {
      return next.handle();
    }

    const startedAt = process.hrtime.bigint();

    return next.handle().pipe(
      finalize(() => {
        const durationSeconds =
          Number(process.hrtime.bigint() - startedAt) / 1_000_000_000;
        const labels = {
          method: request.method,
          route: this.resolveRoute(request),
          status_code: String(response.statusCode),
        };

        this.metricsService.httpRequestsTotal.inc(labels);
        this.metricsService.httpRequestDurationSeconds.observe(
          labels,
          durationSeconds,
        );
      }),
    );
  }

  private shouldSkip(request: Request): boolean {
    const path = request.path ?? request.url?.split('?')[0] ?? '';
    return path === '/metrics';
  }

  private resolveRoute(request: Request): string {
    const routeUnknown: unknown = request.route;
    const routePath = this.extractRoutePath(routeUnknown);

    if (routePath) {
      const baseUrl = request.baseUrl ?? '';
      const fullPath = `${baseUrl}${routePath}`;
      return fullPath.length > 0 ? fullPath : routePath;
    }

    if (typeof request.path === 'string' && request.path.length > 0) {
      return request.path;
    }

    if (typeof request.url === 'string') {
      return request.url.split('?')[0] || 'unknown';
    }

    return 'unknown';
  }

  private extractRoutePath(routeUnknown: unknown): string | undefined {
    if (!routeUnknown || typeof routeUnknown !== 'object') {
      return undefined;
    }

    if (!('path' in routeUnknown)) {
      return undefined;
    }

    const pathValue = routeUnknown.path;
    if (typeof pathValue === 'string') {
      return pathValue;
    }

    if (Array.isArray(pathValue) && typeof pathValue[0] === 'string') {
      return pathValue[0];
    }

    return undefined;
  }
}
