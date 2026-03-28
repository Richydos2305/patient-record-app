export interface SanitizedUser {
    _id: unknown;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RegisterBody {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginBody {
    email: string;
    password: string;
}

export interface LoginResult {
    accessToken: string;
    refreshToken: string;
    user: SanitizedUser;
}

export interface RefreshResult {
    accessToken: string;
    refreshToken: string;
}
