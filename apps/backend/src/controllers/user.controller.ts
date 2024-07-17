import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateUserDTO } from '../dto/user.dto';
import { Response } from 'express';

@Controller('set-user')
export class UserController {
  @Post()
  create(
    @Body() createUserDto: CreateUserDTO,
    @Res({ passthrough: true }) res: Response
  ) {
    res.status(HttpStatus.OK).json({
      "createdUser": {
        "username": createUserDto.username,
        "age": createUserDto.age
      }
    });
  }
}