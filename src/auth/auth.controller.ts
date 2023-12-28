import { Controller, Post, UseGuards, Request, Body, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AccessTokenGuard } from 'src/common/guards/AccessTokenGuard';
import { RefreshTokenGuard } from 'src/common/guards/RefreshTokenGuard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
   * @author Usman Bashir
   * @description LOGIN ROUTE
   * @param req 
   * @returns 
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.loginWithCredentials(req['user']['user']);
  }

  /**
   * @author Usman Bashir
   * @description SIGNUP ROUTE
   * @param createUserDto 
   * @returns 
   */
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }


  /**
   * @author Usman Bashir
   * @description LOGOUT ROUTE
   * @returns 
   */
  @Post('logout')
  async logout() {
    return this.authService.logout();
  }





  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: any) {
    const userId = req['user']['sub'];
    return this.authService.refreshTokens(userId);
  }



}
