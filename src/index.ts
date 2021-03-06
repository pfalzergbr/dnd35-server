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
import { CharacterResolver } from './resolvers/Character';
import { RaceResolver } from './resolvers/Race';
import { CharacterClassResolver } from './resolvers/CharacterClass';

const main = async () => {
  // Schema and Resolvers for GraphQL
  const schema = await buildSchema({
    resolvers: [UserResolver, CharacterResolver, RaceResolver, CharacterClassResolver],
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

  const corsOptions: cors.CorsOptions = {
    origin: ['https://35wizards.netlify.app', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
  }

  //Set up Express App
  const app = Express();
  app.use(cors(corsOptions));
  app.use(cookieParser());
  //Middleware decoding jwt cookies
  app.use((req: any, _, next) => {
    if (req.cookies.jwt) {
      const user = jwt.verify(req.cookies.jwt, keys.JWT_SECRET);
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
