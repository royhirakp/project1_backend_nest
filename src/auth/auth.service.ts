import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SingupDto } from './dto/singup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgetPasswordDto } from './dto/forgetPssword.dto';
import { OtpVarifactionDto } from './dto/otpVarifaction.dto';
import { NewPasswordDto } from './dto/newPassword.dto';
import { ForgetPassword1Dto } from './dto/forgetPassword1.dto';
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async getallUser() {
    const allUser = await this.userModel.find();
    return allUser;
  }

  async singUp(singupDto: SingupDto): Promise<{ token: string }> {
    const { name, email, password } = singupDto;
    const hashedPssword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPssword,
    });

    const token = this.jwtService.sign({
      id: user._id,
    });
    return { token };
  }

  async Login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      throw new UnauthorizedException('worong password');
    }
    const token = this.jwtService.sign({
      id: user._id,
    });
    return { token };
  }

  // RESET PASSWORD TYPE 1
  async forgetPassword1(forgetPassword1Dto: ForgetPassword1Dto) {
    const email = forgetPassword1Dto.email;
    const token = randomstring.generate();

    //update the token in the user field
    const updateToken_atUser = await this.userModel.findOneAndUpdate(
      { email },
      { $set: { token } },
    );
    //handel error
    if (!updateToken_atUser) throw new NotFoundException('user not found');
    setTimeout(async () => {
      await this.userModel.findOneAndUpdate({ email }, { $set: { token: '' } });
    }, 900000);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      // host:"",
      // port: 587,
      // secure: false,
      // requireTLS: true,
      auth: {
        user: 'royhiark@gmail.com',
        pass: 'jvao xmrf azkm ijxq',
      },
    });
    await transporter.sendMail(
      {
        from: 'royhiark@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'forget password. request password reset link', // Subject line
        text: ` link valid fot 15 munite`, // plain text body
        html: `<div>Hello user this is your reset link 
       <b><a href='http://localhost:3000/auth/resetPassword/${token}'>
       click here
       </a></b>.
        or copy this link: http://localhost:3000/auth/resetPassword/${token}
        <h5> link valid fot 15 munite</h5>
        </div>`, // html body
      },

      (error, info) => {
        if (error) {
          console.log(error);
          return {
            status: false,
            error,
          };
        } else {
          return {
            status: true,
            msg: 'eamil send susecfull',
          };
        }
      },
    );
  }

  async resetPassword(newpasswordDto: NewPasswordDto, token: string) {
    const userAsPerToken = await this.userModel.findOne({ token });
    if (!userAsPerToken) throw new NotFoundException('Link has expired');

    const hashedPssword = await bcrypt.hash(newpasswordDto.password, 10);

    const user = await this.userModel.findByIdAndUpdate(
      { _id: userAsPerToken.id },
      { $set: { password: hashedPssword, token: '' } },
      { new: true },
    );
    return { state: 'workif', user };
  }

  // RESET PASSWORD TYPE 2
  async forgetPasswordrequestForOTP(
    forgetPassword_OtpDto: ForgetPasswordDto,
  ): Promise<any> {
    // const userEmail=''
    // user ID
    const random_number_AS_OTP =
      Math.floor(100000 + Math.random() * 900000) + '';
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      // host:"",
      // port: 587,
      // secure: false,
      // requireTLS: true,
      auth: {
        user: 'royhiark@gmail.com',
        pass: 'jvao xmrf azkm ijxq',
      },
    });

    // save tghe otp in the database
    const updatItem = await this.userModel.findByIdAndUpdate(
      { _id: forgetPassword_OtpDto.id },
      { $set: { otp: random_number_AS_OTP } },
    );

    if (!updatItem) throw new NotFoundException('user not found');

    // delete the otp in 15 munite
    setTimeout(async () => {
      await this.userModel.updateOne(
        { email: updatItem.email },
        { $set: { otp: '' } },
      );
    }, 900000);

    const info = await transporter.sendMail(
      {
        from: 'royhiark@gmail.com', // sender address
        to: updatItem.email, // list of receivers
        subject: 'forget password. request for otp', // Subject line
        text: `Hello user this is your otp: ${random_number_AS_OTP}. this OTP is valid for 15 munite`, // plain text body
        html: `Hello user this is your otp: ${random_number_AS_OTP}. this OTP is valid for 15 munite`, // html body
      },
      (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('emal has send : from elece ');
        }
      },
    );
    return {
      status: 'otp mail send',
      updatItem,
      info,
      email: updatItem.email,
    };
  }

  async otpVarification(
    otpVarifactionDto: OtpVarifactionDto,
  ): Promise<{ token: string }> {
    const { otp, id } = otpVarifactionDto;
    //find by id // as the user
    //check the opt for the request body and the data base
    // let user = await this.userModel.findById();
    let user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('user not found');
    if (user.otp !== otp) throw new UnauthorizedException('Invalid otp or');
    const token = this.jwtService.sign({
      id: user._id,
    });
    return { token };
  }

  async newPasswordSet(
    newPassword: NewPasswordDto,
    token: string,
  ): Promise<{ status: number; msg: string }> {
    try {
      const { password } = newPassword;

      //varify the token
      const decoded = this.jwtService.verify(token);
      // get the user id form the token
      //hash the new pass word
      const hashedPssword = await bcrypt.hash(password, 10);
      //set the new password and find the user bt the token decode data
      const updatUser = await this.userModel.findByIdAndUpdate(
        { _id: decoded.id },
        { $set: { password: hashedPssword } },
      );
      if (!updatUser) throw new NotFoundException('user not found');

      return { status: 1, msg: 'password changed susecfully' };
    } catch (error) {
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError'
      ) {
        // Handle invalid token signature error
        throw new UnauthorizedException('Invalid token signature');
      } else {
        // Other JWT verification errors
        throw new UnauthorizedException('Unauthorized');
      }
    }
  }
}
