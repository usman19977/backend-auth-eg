import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {

  }
  /**
   * @author Usman Bashir
   * @description USER DETAILS ROUTE
   * @param req 
   * @returns 
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('getUserDetails')
  async getUserDetails(@Request() req: any) {
    return this.userService.getUserByUserName(req['user']['username']);
  }


}
