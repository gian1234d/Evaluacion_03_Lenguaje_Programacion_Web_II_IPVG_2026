import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: { rol: string } }>();
    if (user?.rol !== 'admin') {
      throw new ForbiddenException('Se requieren permisos de administrador');
    }
    return true;
  }
}
