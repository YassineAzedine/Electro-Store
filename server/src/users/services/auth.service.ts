import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);

    if (!user) throw new NotFoundException('Invalid email');

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) throw new BadRequestException('Invalid password');

    return user;
  }

  async login(username: string, userId: string) {
    const payload = { username, sub: userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}