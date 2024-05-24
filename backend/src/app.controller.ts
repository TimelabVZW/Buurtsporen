import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.gaurd';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Post('login')
  login(@Request() req): any {
    return this.authService.login(req.body);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(): string {
    // TODO: require a access token, validate token
    return this.appService.getHello();
  }
}