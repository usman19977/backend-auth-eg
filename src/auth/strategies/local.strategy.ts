import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "../auth.service";

/**
 * @author Usman Bashir
 * @description Json Web Token Local Strategy
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {

        super();
    }

    async validate(email: string, password: string): Promise<any> {

        const user = await this.authService.validateUserCredentials(
            email,
            password,
        )

        if (!user) {
            throw new UnauthorizedException('Email or password is incorrect');
        }


        return { user };

    }
}