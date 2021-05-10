import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { connect } from 'mongoose';


import keys from './config/keys';

//Resolvers
import { UserResolver } from './resolvers/User'

//Models
import { UserModel } from './entities/Users';

const main = async () => {
  const schema = await buildSchema({
    resolvers: [ UserResolver],
    emitSchemaFile: true,
    validate: false,
  });

  const mongoose = await connect(keys.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await mongoose.connection


  const server = new ApolloServer({ schema });
  const app = Express();
  server.applyMiddleware({ app });
  app.listen({ port: keys.PORT }, () => {
    console.log(
      `🐉 Server ready for adventure at http://localhost:${keys.PORT}${server.graphqlPath} 🧙`
    );
  });
};


main().catch(error => console.log(error, 'error'))

// const me = new UserModel({email: 'jon.snow@nightswatch.gov', password:'supersecrethashedstuff'})
// me.save()