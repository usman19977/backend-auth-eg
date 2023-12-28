import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './interface/user.interface';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @Inject("USER_MODEL")
        private userModel: Model<User>,

    ) { }

    /**
     * @author Usman Bashir
     * @description CREATE'S USER DOCUMENT
     * @param createUserDto 
     * @returns 
     */
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        return this.userModel.create(createUserDto);
    }

    /**
     * @author Usman Bashir
     * @param id 
     * @description RETURN'S USER BY ID
     * @returns 
     */
    async findById(id: string): Promise<User> {
        return this.userModel.findById(id);
    }

    /**
     * @author Usman Bashir
     * @description GET ALL USERS
     * @returns 
     */
    async getUsers(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    /**
     * @author Usman Bashir
     * @description GET SPECIFIC USER BY EMAIL PASSWORD
     * @param param0 
     * @returns 
     */
    async getUser({ email, password }): Promise<User | undefined> {
        return this.userModel.findOne({
            email,
            password
        })
    }

    /**
     * @author Usman Bashir
     * @description GET'S USER BY EMAIL PASSWORD ( AUTHENTICATION )
     * @param param0 
     * @returns 
     */
    async getUserByUserNamePassword({ email, password }: { email: string, password: string }): Promise<User | undefined> {

        let user = await this.userModel.findOne({ email }).exec();;
        if (!user) return undefined;
        const match = await bcrypt.compare(password, user.password);
        if (!match) return undefined;
        return user;

    }

    /**
     * @author Usman Bashir
     * @description GET USER BY USER NAME
     * @param email 
     * @returns 
     */
    async getUserByUserName(email: string): Promise<User | undefined> {
        let user = await this.userModel.findOne({ email }).select('-password').exec();
        if (!user) return undefined;
        return user;

    }

    /**
     * @author Usman Bashir
     * @description UPDATE'S SPECIFIC USER
     * @param id 
     * @param updateUserDto 
     * @returns 
     */
    async update(
        id: string,
        updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .exec();
    }


}


