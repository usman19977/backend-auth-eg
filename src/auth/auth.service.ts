import { BadRequestException, Injectable, InternalServerErrorException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/interface/user.interface';

@Injectable()
export class AuthService {
    constructor(

        private userService: UserService,
        private jwtService: JwtService,


    ) { }

    async validateUserCredentials(
        email: string,
        password: string
    ) {
        const user = await this.userService.getUserByUserNamePassword({ email, password });
        return user ?? null;
    }
    async loginWithCredentials(user: User) {

        const tokens = await this.getTokens(user._id, user.email);
        return {
            user:
            {
                name: user.name,
                email: user.email,
            },
            tokens,
            success_message: "Login Successfully !"
        };

    }
    async signUp(createUserDto: CreateUserDto) {
        const userExists = await this.userService.getUserByUserName(
            createUserDto.email,
        );

        if (userExists) {
            throw new BadRequestException('User already exists');
        }
        const hash = await this.getHashData(createUserDto.password);
        let user = await this.userService.createUser({
            ...createUserDto,
            password: hash,
        });

        const tokens = await this.getTokens(user._id, user.email);
        return {
            user:
            {
                name: user.name,
                email: user.email,
            },
            tokens,
            success_message: "'User Registered Successfully !"
        };


    }
    async getHashData(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        return hashPassword;
    }
    async getTokens(userId: string, username: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.sign(
                {
                    sub: userId,
                    username,
                },
                {
                    secret: process.env.JWT_SECRET,
                    expiresIn: '10s',
                },
            ),
            this.jwtService.sign(
                {
                    sub: userId,
                    username,
                },
                {
                    secret: process.env.JWT_REFRESH_SECRET,
                    expiresIn: '7d',
                },
            ),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async logout() {
        /**
         * We Can save the log when user loggs out in backend
         */
        return { success_message: 'Logout Successfully' };
    }
    async refreshTokens(userId: string) {

        let user = await this.userService.findById(userId);
        const tokens = await this.getTokens(userId, user.email);
        return tokens;
    }
    async userDetails(id: any, email: string, req: any) {
        try {
            let getUserById = await this.userService.findById(id);
            const tokens = await this.getTokens(id, email);
            return {
                user: {
                    name: getUserById.name,
                    email: getUserById.email
                }, tokens
            };


        }
        catch (ex) {
            throw new InternalServerErrorException(ex.toString());
        }
    }

}
