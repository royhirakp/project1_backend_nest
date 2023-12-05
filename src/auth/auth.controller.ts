import { Controller, Body, Post, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingupDto } from './dto/singup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgetPasswordDto } from './dto/forgetPssword.dto';
import { OtpVarifactionDto } from './dto/otpVarifaction.dto';
import { NewPasswordDto } from './dto/newPassword.dto';
import { ForgetPassword1Dto } from './dto/forgetPassword1.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/singup')
  singUp(@Body() SingupDto: SingupDto): Promise<{ token: string }> {
    return this.authService.singUp(SingupDto);
  }
  @Get('/login')
  logIn(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.Login(loginDto);
  }

  @Get()
  getAlluser() {
    return this.authService.getallUser();
  }

  // RESET PASSWORD TYPE 1

  @Get('/forgetPassword1')
  sendEmailforResetPassword(@Body() forgetPassword1Dto: ForgetPassword1Dto) {
    return this.authService.forgetPassword1(forgetPassword1Dto);
  }

  @Get('/resetPassword/:token')
  resetPassword(
    @Body() newpasswordDto: NewPasswordDto,
    @Param('token')
    token: string,
  ) {
    return this.authService.resetPassword(newpasswordDto, token);
  }

  // RESET PASSWORD TYPE 2

  @Get('/forgetPassword2')
  ForgetMail(@Body() forgetPassword_OtpDto: ForgetPasswordDto) {
    return this.authService.forgetPasswordrequestForOTP(forgetPassword_OtpDto);
  }

  @Get('/otp_Varifaction2')
  Otp_Varifaction(@Body() otpVarifactionDto: OtpVarifactionDto) {
    return this.authService.otpVarification(otpVarifactionDto);
  }

  @Get('/newPassword2/:token')
  newPassword(
    @Body() newPassword: NewPasswordDto,
    @Param('token')
    token: string,
  ) {
    return this.authService.newPasswordSet(newPassword, token);
  }
}
