import { BaseRepository } from './BaseRepository';
import { User, UserDocument } from '../models/User';

export class UserRepository extends BaseRepository<UserDocument> {
  constructor() {
    super(User);
  }
}
