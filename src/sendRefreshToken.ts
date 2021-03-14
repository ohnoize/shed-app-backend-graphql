import { Response } from 'express';

export const sendRefreshToken = (res: Response, token: string): void => {
  if (res) {
    res.cookie('saID', token, {
      sameSite: 'none',
      httpOnly: false,
      maxAge: 100000000,
      path: '/refresh_token',
    });
  }
};
