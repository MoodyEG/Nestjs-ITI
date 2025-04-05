import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signUp')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        password: { type: 'string' },
      },
    },
    examples: {
      user: {
        value: {
          name: 'username',
          password: 'password',
        },
      },
    },
  })
  signUp(
    @Body('name') name: string,
    @Body('password') password: string,
  ): Promise<string> {
    return this.userService.signUp(name, password);
  }

  @Post('signIn')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        password: { type: 'string' },
      },
    },
    examples: {
      user: {
        value: {
          name: 'username',
          password: 'password',
        },
      },
    },
  })
  signIn(
    @Body('name') name: string,
    @Body('password') password: string,
  ): Promise<{ name: string; token: string }> {
    return this.userService.signIn(name, password);
  }

  @ApiBearerAuth()
  @Get('protected')
  protected(): string {
    return this.userService.protectedRoute();
  }
}
