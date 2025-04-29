import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guards';
import { SignUpDto } from './dto/signup';
import { SignInDto } from './dto/signin';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('/signUp') //user/signUp
  async signUp(@Body() signUpData: SignUpDto){
      return this.authService.signUp(signUpData);
  }

  @Post('/signIn') //user/signIn
  async signIn(@Body() signInData: SignInDto){
     return this.authService.signIn(signInData); 

  }

  
  @UseGuards(AuthGuard)
  @Post('/logout') //user/logout
  async logout(@Req() req:Request){        
      return this.authService.logout(req);
  }

  @Post('/refreshToken') //user/refreshToken
  async refreshToken(@Body() body:{refreshToken: string}){

      return this.authService.refreshToken(body.refreshToken);
  }
}
