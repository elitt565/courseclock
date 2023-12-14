// IPassword.ts
import { Document, Types, Model, Schema } from 'mongoose';
import mongoose from 'mongoose';

export interface IPassword extends Document {
  user: Schema.Types.ObjectId;
  hash_pass: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents the interface for the Password Model.
 */
export interface IPasswordModel extends Model<IPassword> {
  /**
   * Saves a password for a given ID.
   * @param id The ID of the password.
   * @param password The password to be saved.
   * @returns A promise that resolves to the saved password.
   */
  savePassword(id: Types.ObjectId, password: string): Promise<IPassword>;

  /**
   * Updates a password for a given ID.
   * @param id The ID of the password.
   * @param password The new password to be updated.
   * @returns A promise that resolves to the updated password.
   */
  updatePassword(id: Types.ObjectId, password: string): Promise<IPassword>;

  /**
   * Checks if a password matches the one associated with a given ID.
   * @param id The ID of the password.
   * @param password The password to be checked.
   * @returns A promise that resolves to a boolean indicating whether the password matches or not.
   */
  checkPassword(id: Types.ObjectId, password: string): Promise<boolean>;
}
