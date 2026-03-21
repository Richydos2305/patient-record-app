import { Response } from 'express';
import { sign, type SignOptions } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { settings } from '../config/application';
import { TokenConfig } from '../constants';
import { UserDocument } from '../models/User';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { UserRepository } from '../repositories/UserRepository';
import { RefreshTokenDocument } from '../models/RefreshToken';
import { SanitizedUser, ResponseHandlerParams } from '../interfaces/helpers';
import { NotFoundError, UnauthorizedError } from '../errors/CustomErrors';
import logger from './logger';

export function sanitizeUser(user: UserDocument): SanitizedUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email
  };
}

export async function getTokens(user: UserDocument): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> {
  const signOptions: SignOptions = { expiresIn: TokenConfig.AccessTokenExpiry as SignOptions['expiresIn'] };
  const accessToken = sign(
    {
      userDetails: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    },
    settings.secretKey,
    signOptions
  );

  const refreshToken = randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + TokenConfig.RefreshTokenExpiryMs);

  const refreshTokenRepository = new RefreshTokenRepository();
  await refreshTokenRepository.create({
    userId: user._id.toString(),
    token: refreshToken,
    expiresAt,
    isRevoked: false
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: TokenConfig.AccessTokenExpirySeconds
  };
}

export async function getUser(id: string): Promise<UserDocument> {
  const userRepository = new UserRepository();
  const user = await userRepository.find({ _id: id });
  if (!user) {
    logger.warn('User not found', { id });
    throw new NotFoundError('User not found');
  }
  return user;
}

export async function getRefreshToken(token: string): Promise<RefreshTokenDocument> {
  const refreshTokenRepository = new RefreshTokenRepository();
  const refreshToken = await refreshTokenRepository.find({ token });
  if (!refreshToken) {
    logger.warn('Refresh token not found');
    throw new UnauthorizedError('Invalid refresh token');
  }
  return refreshToken;
}

export function assertRefreshTokenIsValid(refreshToken: RefreshTokenDocument): void {
  if (refreshToken.isRevoked) {
    logger.warn('Refresh token is revoked', { userId: refreshToken.userId });
    throw new UnauthorizedError('Refresh token has been revoked');
  }
  if (refreshToken.expiresAt < new Date()) {
    logger.warn('Refresh token expired', { userId: refreshToken.userId });
    throw new UnauthorizedError('Refresh token has expired');
  }
}

export function responseHandler(res: Response, result: ResponseHandlerParams): void {
  const { status = 200, message = 'Success', data = {} } = result;
  res.status(status).json({ success: true, message, data });
}
