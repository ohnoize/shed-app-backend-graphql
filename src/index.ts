/* eslint-disable no-console */
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import createSchema from './graphql/schema';
import User, { UserBaseDocument } from './models/user';
import { createNewToken, createRefreshToken } from './auth';
import config from './utils/config';
import { TokenUserType } from './types';
import { sendRefreshToken } from './sendRefreshToken';

console.log('Connectingg to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

export const schema = createSchema();

const server = new ApolloServer({
  schema,
  introspection: true,
  playground: true,
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decodedToken: TokenUserType = <any>jwt.verify(
        auth.substring(7), config.SECRET_KEY,
      );
      const currentUser: UserBaseDocument = await User.findOne({ _id: decodedToken.id });
      return { currentUser, res, req };
    }
    return { res, req };
  },
});

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(cookieParser());
server.applyMiddleware({ app });

app.get('/', (_req, res) => res.send('Yello!'));

app.post('/refresh_token', async (req, res) => {
  const token = req.cookies.saID;
  if (!token) {
    return res.send({ success: false, token: '' });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let decodedRefreshToken: any = null;
  try {
    decodedRefreshToken = jwt.verify(token, config.REFRESH_SECRET_KEY);
  } catch (e) {
    return res.send({ success: false, token: '' });
  }
  const user = await User.findOne({ _id: decodedRefreshToken.id });

  if (!user) {
    return res.send({ success: false, token: '' });
  }
  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const userForRefreshToken = {
    id: user.id,
  };

  res.cookie('saID', createRefreshToken(userForRefreshToken), {
    httpOnly: true,
  });

  sendRefreshToken(res, createRefreshToken(userForRefreshToken));

  return res.send({ success: true, token: createNewToken(userForToken) });
});

app.listen({ port: process.env.PORT || config.PORT }, () => {
  // eslint-disable-next-line no-console
  console.log(`Server ready at ${server.graphqlPath}`);
});
