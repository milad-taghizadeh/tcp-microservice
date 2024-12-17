import { ApiProperty } from '@nestjs/swagger';

export class UserSignup {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
