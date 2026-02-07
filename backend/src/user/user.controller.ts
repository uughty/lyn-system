import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-admin')
  createAdmin(): Promise<User> {
    return this.userService.createAdmin();
  }
}
