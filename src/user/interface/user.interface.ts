import { Document } from 'mongoose';

/**
 * @author Usman Bashir
 * @description USER INTERFACE
 */
export interface User extends Document {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

