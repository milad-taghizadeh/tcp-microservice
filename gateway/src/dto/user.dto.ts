import { ApiProperty, OmitType } from '@nestjs/swagger';

export class UserSignup {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class LoginDto extends OmitType(UserSignup, ['name']) {}
