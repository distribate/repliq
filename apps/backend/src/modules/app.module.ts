import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';

@Module({
  imports: [],
  controllers: [
    UserController,
  ]
})

export class AppModule {}