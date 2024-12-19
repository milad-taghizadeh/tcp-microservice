import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { IFindById, ILogin, ISignup } from './interface/user.interface';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async signup(signupDto: ISignup) {
    let { email, name, password } = signupDto;
    email = email.toLowerCase();
    let user = await this.userModel.findOne({ email });
    if (user) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'User already exists with this email address',
        error: true,
      };
    }
    const salt = genSaltSync();
    const hashed = hashSync(password, salt);
    user = await this.userModel.create({ email, name, password: hashed });
    return {
      status: HttpStatus.CREATED,
      message: 'User created successfully',
      data: { userId: user._id.toString() },
    };
  }
  async login(loginDto: ILogin) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'User not found with this email address',
        error: true,
      };
    }
    if (compareSync(password, user.password)) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'username or password incorrect',
        error: true,
      };
    }
    return {
      data: {
        userId: user._id.toString(),
      },
      status: HttpStatus.OK,
    };
  }
  getById(findDto: IFindById) {
    console.log(findDto);
  }
}
