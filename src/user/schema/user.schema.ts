import * as mongoose from 'mongoose';

/**
 * @author Usman Bashir
 * @description USER DOCUMENT DEFINATION
 */
export const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });