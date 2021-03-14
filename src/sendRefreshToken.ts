import { Response } from 'express';

export const sendRefreshToken = (res: Response, token: string): void => {
  if (res) {
    res.cookie('saID', token, {
      sameSite: 'none',
      secure: true,
      httpOnly: false,
      maxAge: 100000000,
      path: '/refresh_token',
    });
  }
};
