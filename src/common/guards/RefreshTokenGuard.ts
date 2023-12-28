import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

/**
 * @author Usman Bashir
 * @description THIS IS A GUARD THAT WILL CHECK THE HTTP REQUEST AND VALIDATE'S REFRESH TOKEN
 */
@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
    handleRequest(err: any, user: any, info: any, context: any, status: any) {
        if (info instanceof JsonWebTokenError && info.name === 'JsonWebTokenError') {
            throw new UnauthorizedException({ ...info, message: 'Invalid refresh token' });
        }
        else if (info instanceof JsonWebTokenError && info.name === 'TokenExpiredError') {
            throw new UnauthorizedException({ ...info, message: 'Refresh Token Expired' });
        }
        return super.handleRequest(err, user, info, context, status);
    }
}