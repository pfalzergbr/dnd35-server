import { mongoose } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { User, UserModel } from '../entities/User';
import { UserInput } from '../entities/user-input';


@Resolver()
export class UserResolver {
  @Query(() => User)
  async getUserByEmail(@Arg('email') email: string) {
    return await UserModel.findOne({ email });
  }

  // @Query(() => User)
  // async login(@Arg('data') {email, password}: UserInput): Promise<User>{
    // const match = await bcrypt.compare(password, hashedpassword )
    // if (match) {

    // }
  // }


  @Mutation(() => User)
  async createUser(@Arg('data') { email, password }: UserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(password as string, 10)
    const user = new UserModel({
      _id: mongoose.Types.ObjectId(),
      email,
      password: hashedPassword,
    });
    try {
      await user.save();
    } catch (error) {
      console.log('Something went wrong here')
    }
    return user;
  }
}
