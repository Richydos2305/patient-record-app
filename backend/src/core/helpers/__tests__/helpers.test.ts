import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { sanitizeUser, assertRefreshTokenIsValid } from '../index';
import { UnauthorizedError } from '../../errors/CustomErrors';
import { User } from '../../models/User';
import { RefreshToken } from '../../models/RefreshToken';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Promise.all(
    Object.values(mongoose.connection.collections).map(col => col.deleteMany({}))
  );
});

describe('sanitizeUser', () => {
  it('returns id, name, email only', async () => {
    const user = await User.create({ name: 'Alice', email: 'alice@test.com', password: 'secret' });
    const sanitized = sanitizeUser(user);
    expect(sanitized.id).toBeDefined();
    expect(sanitized.name).toBe('Alice');
    expect(sanitized.email).toBe('alice@test.com');
    expect((sanitized as unknown as Record<string, unknown>).password).toBeUndefined();
  });
});

describe('assertRefreshTokenIsValid', () => {
  it('does not throw for a valid token', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const token = await RefreshToken.create({
      userId,
      token: 'valid-token',
      expiresAt: new Date(Date.now() + 86400000),
      isRevoked: false
    });
    expect(() => assertRefreshTokenIsValid(token)).not.toThrow();
  });

  it('throws UnauthorizedError for revoked token', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const token = await RefreshToken.create({
      userId,
      token: 'revoked-token',
      expiresAt: new Date(Date.now() + 86400000),
      isRevoked: true
    });
    expect(() => assertRefreshTokenIsValid(token)).toThrow(UnauthorizedError);
  });

  it('throws UnauthorizedError for expired token', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const token = await RefreshToken.create({
      userId,
      token: 'expired-token',
      expiresAt: new Date(Date.now() - 1000),
      isRevoked: false
    });
    expect(() => assertRefreshTokenIsValid(token)).toThrow(UnauthorizedError);
  });
});
