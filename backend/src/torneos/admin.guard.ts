import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user?: { role?: string };
      headers: Record<string, string | string[] | undefined>;
    }>();
    const role =
      request.user?.role ??
      (typeof request.headers['x-user-role'] === 'string'
        ? request.headers['x-user-role']
        : undefined);

    if (role?.toLowerCase() !== 'admin') {
      throw new ForbiddenException('Se requieren permisos de administrador');
    }
    return true;
  }
}
