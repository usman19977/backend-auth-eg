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

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        return this.userModel.create(createUserDto);
    }
    async findById(id: string): Promise<User> {
        return this.userModel.findById(id);
    }
    async getUsers(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async getUser({ email, password }): Promise<User | undefined> {
        return this.userModel.findOne({
            email,
            password
        })
    }

    async getUserByUserNamePassword({ email, password }: { email: string, password: string }): Promise<User | undefined> {

        let user = await this.userModel.findOne({ email }).exec();;
        if (!user) return undefined;
        const match = await bcrypt.compare(password, user.password);
        if (!match) return undefined;
        return user;

    }

    async getUserByUserName(email: string): Promise<User | undefined> {
        let user = await this.userModel.findOne({ email }).select('-password').exec();
        if (!user) return undefined;
        return user;

    }

    async update(
        id: string,
        updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .exec();
    }


}


