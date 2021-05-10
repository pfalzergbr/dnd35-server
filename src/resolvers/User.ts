import { mongoose } from '@typegoose/typegoose';
import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { User, UserModel } from '../entities/User';
import { UserInput } from '../entities/user-input';

@Resolver()
export class UserResolver {
  @Query(() => User)
  async getUserByEmail(@Arg('email') email: string) {
    return await UserModel.findOne({ email });
  }

  @Mutation(() => User)
  async createUser(@Arg('data') { email, password }: UserInput): Promise<User> {
    const user = new UserModel({
      _id: mongoose.Types.ObjectId(),
      email,
      password,
    });
    await user.save();
    return user;
  }
}
