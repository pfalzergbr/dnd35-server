import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { connect } from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import keys from './config/keys';

//Resolvers
import { UserResolver } from './resolvers/User';

const main = async () => {
  // Schema and Resolvers for GraphQL
  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: true,
    validate: true,
  });

  //Mongoose connection
  const mongoose = await connect(keys.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await mongoose.connection;

  //Set up Apollo Server
  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  //Set up Express App
  const app = Express();
  app.use(
    cors(
      {
      origin: [keys.FRONTEND_ORIGIN],
      credentials: true,
    }
    )
  );
  app.use(cookieParser());
  //Middleware decoding jwt cookies
  app.use((req: any, _, next) => {
    if (req.cookies.jwt) {
      const user = jwt.verify(req.cookies.jwt, keys.JWT_SECRET);
      console.log(req.headers)
      req.user = user;
    }
    return next();
  });

  // Connect Express and Apollo
  server.applyMiddleware({ app, cors: false });

  app.listen({ port: keys.PORT }, () => {
    console.log(
      `🐉 Server ready for adventure at http://localhost:${keys.PORT}${server.graphqlPath} 🧙`
    );
  });
};

main().catch((error) => console.log(error, 'error'));
