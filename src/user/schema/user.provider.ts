import { Mongoose } from 'mongoose';
import { UserSchema } from './user.schema';

/**
 * @author Usman Bashir
 * @description Database Provider | Connection ( Instance )
 */
export const userProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (mongoose: Mongoose) => {

      return mongoose.model('User', UserSchema)
    },
    inject: ['DATABASE_CONNECTION'],
  }
];