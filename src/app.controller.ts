import {
  Controller,
  Body,
  Get,
  Post,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { Session } from './auth/session/session.decorator';
import { AuthService } from './auth/auth.service';

class CreateCustomerDto {
  email: string;
  password: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/signin')
  @HttpCode(200)
  async userSignIn(@Body() createCustomerDto: CreateCustomerDto) {
    const { email, password } = createCustomerDto;

    const resp = await this.authService.signInWithEmailPassword(
      email,
      password,
    );

    return resp;
  }

  @Post('/signup')
  @HttpCode(200)
  async userSignUp(@Body() createCustomerDto: CreateCustomerDto) {
    const { email, password } = createCustomerDto;

    const resp = await this.authService.signUpWithEmailPassword(
      email,
      password,
    );

    return resp;
  }

  @Get('/session')
  @UseGuards(new AuthGuard())
  userSession(@Session() session: SessionContainer): string {
    const userId = session.getUserId();

    return userId;
  }
}
