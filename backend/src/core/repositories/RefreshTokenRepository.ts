import { BaseRepository } from './BaseRepository';
import { RefreshToken, RefreshTokenDocument } from '../models/RefreshToken';

export class RefreshTokenRepository extends BaseRepository<RefreshTokenDocument> {
  constructor() {
    super(RefreshToken);
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await RefreshToken.updateMany({ userId }, { isRevoked: true }).exec();
  }
}
