import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { UserRepository } from '../../repositories/UserRepository';
import { RefreshTokenRepository } from '../../repositories/RefreshTokenRepository';
import { validateRegisterPayload, validateLoginPayload } from '../../helpers/validation';
import { sanitizeUser } from '../../helpers/index';
import { SecurityConfig } from '../../constants';
import { settings } from '../../config/application';
import { ConflictError, UnauthorizedError } from '../../errors/CustomErrors';
import { SanitizedUser, LoginResult, RefreshResult, RegisterBody, LoginBody } from './interface';

export class AuthService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly tokenRepo: RefreshTokenRepository,
    ) {}

    async register(body: RegisterBody): Promise<SanitizedUser> {
        validateRegisterPayload(body);

        const existing = await this.userRepo.findOne({ email: body.email });
        if (existing) throw new ConflictError('Email already registered');

        const hashedPassword = await bcrypt.hash(body.password, SecurityConfig.BCRYPT_ROUNDS);
        const user = await this.userRepo.create({ ...body, password: hashedPassword });
        return sanitizeUser(user);
    }

    async login(body: LoginBody): Promise<LoginResult> {
        validateLoginPayload(body);

        const user = await this.userRepo.findOne({ email: body.email });
        if (!user) throw new UnauthorizedError('Invalid credentials');

        const match = await bcrypt.compare(body.password, user.password);
        if (!match) throw new UnauthorizedError('Invalid credentials');

        const accessToken = jwt.sign(
            { id: user._id.toString(), role: user.role },
            settings.jwtAccessSecret,
            { expiresIn: '1h' },
        );
        const refreshToken = jwt.sign(
            { id: user._id.toString() },
            settings.jwtRefreshSecret,
            { expiresIn: '7d' },
        );

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.tokenRepo.create({
            token: refreshToken,
            userId: user._id,
            expiresAt,
            isRevoked: false,
        });

        return { accessToken, refreshToken, user: sanitizeUser(user) };
    }

    async refresh(token: string): Promise<RefreshResult> {
        const tokenRecord = await this.tokenRepo.findOne({ token, isRevoked: false });
        if (!tokenRecord) throw new UnauthorizedError('Invalid or revoked refresh token');

        let payload: { id: string };
        try {
            payload = jwt.verify(token, settings.jwtRefreshSecret) as { id: string };
        } catch {
            throw new UnauthorizedError('Invalid or expired refresh token');
        }

        await this.tokenRepo.updateOne(
            tokenRecord._id.toString(),
            { isRevoked: true },
            { new: true },
        );

        const accessToken = jwt.sign(
            { id: payload.id },
            settings.jwtAccessSecret,
            { expiresIn: '1h' },
        );
        const newRefreshToken = jwt.sign(
            { id: payload.id },
            settings.jwtRefreshSecret,
            { expiresIn: '7d' },
        );

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.tokenRepo.create({
            token: newRefreshToken,
            userId: new Types.ObjectId(payload.id),
            expiresAt,
            isRevoked: false,
        });

        return { accessToken, refreshToken: newRefreshToken };
    }

    async logout(token: string): Promise<void> {
        const tokenRecord = await this.tokenRepo.findOne({ token });
        if (!tokenRecord) return;

        await this.tokenRepo.updateOne(
            tokenRecord._id.toString(),
            { isRevoked: true },
            { new: true },
        );
    }
}
