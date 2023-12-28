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

    /**
     * @author Usman Bashir
     * @description METHOD WILL VALIDATE USE CREDENTIALS
     * @param email 
     * @param password 
     * @returns 
     */
    async validateUserCredentials(
        email: string,
        password: string
    ) {
        const user = await this.userService.getUserByUserNamePassword({ email, password });
        return user ?? null;
    }

    /**
     * @author Usman Bashir
     * @description FUNCTION WILL LOGIN USER AND RETURN AUTH TOKEN | REFRESH TOKEN
     * @param user 
     * @returns 
     */
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

    /**
     * @author Usman Bashir
     * @description FUNCTION WILL CREATE USER
     * @param createUserDto 
     * @returns 
     */
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

    /**
     * @author Usman Bashir
     * @description FUNCTION WILL GENERATE AND RETURN ENCRYPTED STRING
     * @param password 
     * @returns 
     */
    async getHashData(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        return hashPassword;
    }

    /**
     * @author Usman Bashir
     * @description FUNCTION WILL RETURN TOKENS
     * @param userId 
     * @param username 
     * @returns 
     */
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

    /**
     * @author Usman Bashir
     * @description FUNCTION WILL LOG'S USER OUT | REVOKE A TOKEN IF MAINTAINING IN DB 
     * @returns 
     */
    async logout() {
        /**
         * We Can save the log when user loggs out in backend
         */
        return { success_message: 'Logout Successfully' };
    }

    /**
     * @author Usman Bashir
     * @description FUNCTION WILL REFRESH THE TOKEN
     * @param userId 
     * @returns 
     */
    async refreshTokens(userId: string) {

        let user = await this.userService.findById(userId);
        const tokens = await this.getTokens(userId, user.email);
        return tokens;
    }

    /**
     * @author Usman Bashir
     * @description WILL RETURN USER DETAILS
     * @param id 
     * @param email 
     * @param req 
     * @returns 
     */
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
