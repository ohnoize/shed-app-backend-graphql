import jwt from 'jsonwebtoken';
import config from './utils/config';
import { TokenUserType } from './types';

export type RefreshTokenUser = Omit<TokenUserType, 'username'>;

export const createNewToken = (userForToken: TokenUserType): string => (
  jwt.sign(userForToken, config.SECRET_KEY, { expiresIn: '12h' })
);

export const createRefreshToken = (userForToken: RefreshTokenUser): string => (
  jwt.sign(userForToken, config.REFRESH_SECRET_KEY, { expiresIn: '7d' })
);
