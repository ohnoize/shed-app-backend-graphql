import { Response } from 'express';

export const sendRefreshToken = (res: Response, token: string): void => {
  res.cookie('saID', token, {
    httpOnly: true,
  });
};
