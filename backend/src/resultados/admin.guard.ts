import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

interface AuthenticatedRequest {
  user?: { role?: string };
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    if (request.user?.role?.toLowerCase() !== 'admin') {
      throw new ForbiddenException('Se requieren permisos de administrador');
    }
    return true;
  }
}
