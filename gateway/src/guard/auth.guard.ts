import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('USER_SERVICE') private userClientService: ClientProxy,
    @Inject('TOKEN_SERVICE') private tokenClientService: ClientProxy,
  ) {}
  async canActivate(context: ExecutionContext) {
    const httpContext: HttpArgumentsHost = context.switchToHttp();
    const request: Request = httpContext.getRequest<Request>();
    const { authorization } = request?.headers;
    if (!authorization)
      throw new UnauthorizedException('authorization is required');
    const [bearer, token] = authorization.split(' ');
    if (!bearer || !token)
      throw new UnauthorizedException('authorization is required');
    if (bearer?.toLowerCase() !== 'bearer')
      throw new UnauthorizedException('authorization is required');
    const verifyResult = await lastValueFrom(
      this.tokenClientService.send('verify_token', { token }),
    );
    if (verifyResult?.error)
      throw new HttpException(verifyResult.message, verifyResult.status);
    const { data } = verifyResult;
    if (!data?.userId) throw new UnauthorizedException('not found account');
    const userResult = await lastValueFrom(
      this.userClientService.send('get_user_by_id', {
        userId: data?.userId,
      }),
    );
    if (userResult?.error) {
      throw new HttpException(userResult.message, userResult.status);
    }
    if (!userResult?.data?.user)
      throw new UnauthorizedException('not found user account');
    request.user = userResult?.data?.user;
    return true;
  }
}
