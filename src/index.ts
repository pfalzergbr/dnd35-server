import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { connect } from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser'
import keys from './config/keys';

//Resolvers
import { UserResolver } from './resolvers/User';

const main = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: true,
    validate: true,
  });

  const mongoose = await connect(keys.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await mongoose.connection;

  const server = new ApolloServer({
    schema,
    context: ({req, res}) => ({req, res})
  });


  const app = Express();
  app.use(cors({
    credentials: true,
    origin: keys.FRONTEND_ORIGIN
  }));
  app.use(cookieParser())
  app.use((req: any , _, next) => {
    try {
      const user = jwt.verify(req.cookies.jwt, keys.JWT_SECRET)
      req.user = user
    } catch (error) {
      console.log(error)
    }
    return next();
  })

  server.applyMiddleware({ app });
  app.listen({ port: keys.PORT }, () => {
    console.log(
      `🐉 Server ready for adventure at http://localhost:${keys.PORT}${server.graphqlPath} 🧙`
    );
  });
};

main().catch((error) => console.log(error, 'error'));
