import { Mongoose } from 'mongoose';
import { UserSchema } from './user.schema';


export const userProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (mongoose: Mongoose) => {

      return mongoose.model('User', UserSchema)
    },
    inject: ['DATABASE_CONNECTION'],
  }
];