import {
  Body,
  Controller,
  HttpException,
  Inject,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiConsumes } from '@nestjs/swagger';
import { UserSignup } from './dto/user.dto';
import { catchError, lastValueFrom } from 'rxjs';
import { error } from 'console';

@Controller('/user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private userClientService: ClientProxy,
    @Inject('TOKEN_SERVICE') private tokenClientService: ClientProxy,
  ) {}

  @Post('signup')
  @ApiConsumes('application/x-www-form-urlencoded')
  async signup(@Body() signupDto: UserSignup) {
    const response = await lastValueFrom(
      this.userClientService.send('signup', signupDto).pipe(
        catchError((err) => {
          throw err;
        }),
      ),
    );
    if (response?.error) {
      throw new HttpException(response?.message, response?.status ?? 500);
    }
    if (response?.data?.userId) {
      const tokenResponse = await lastValueFrom(
        this.tokenClientService.send('create_user_token', {
          userId: response?.data?.userId,
        }),
      );
      if (tokenResponse?.data?.token) {
        return { token: tokenResponse?.data?.token };
      }
    }
    throw new InternalServerErrorException(
      'some services are missing or invalid',
    );
  }
}
