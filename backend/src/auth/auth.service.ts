import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    const passwordValid = await bcrypt.compare(password, user.password);

    if (passwordValid) {
      const { password, ...rest } = user;
      return rest;
    }

    return null;
  }

  async login(user: User) {
    const {password, ...rest} = user;

    return {
      access_token: this.jwtService.sign(rest),
    };
  }
}
