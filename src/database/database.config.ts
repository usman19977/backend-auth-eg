import * as mongoose from 'mongoose';

/**
 * @author Usman Bashir
 * @description Database Provider | Connection ( Instance )
 */
export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect(process.env.MONGO_URI),
  },
];