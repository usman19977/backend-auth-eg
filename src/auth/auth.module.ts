import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10s' }
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
