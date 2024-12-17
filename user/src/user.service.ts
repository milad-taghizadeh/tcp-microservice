import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { IFindById, ILogin, ISignup } from './interface/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  signup(signupDto: ISignup) {
    console.log(signupDto);
  }
  login(loginDto: ILogin) {
    console.log(loginDto);
  }
  getById(findDto: IFindById) {
    console.log(findDto);
  }
}
