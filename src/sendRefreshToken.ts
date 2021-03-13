import { Response } from 'express';

export const sendRefreshToken = (res: Response, token: string): void => {
  if (res) {
    res.cookie('saID', token, {
      httpOnly: true,
      path: '/refresh_tokens',
    });
  }
};
