import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiConsumes } from '@nestjs/swagger';
import { UserSignup } from './dto/user.dto';
import { catchError, lastValueFrom } from 'rxjs';

@Controller('/user')
export class UserController {
  constructor(@Inject('USER_SERVICE') private userClientService: ClientProxy) {}

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
    return response;
  }
}
