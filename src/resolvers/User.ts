import { mongoose } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Resolver, Query, Arg, Mutation, Ctx } from 'type-graphql';
import { User, UserModel } from '../entities/User';
import { UserInput } from '../entities/user-input';
import keys from '../config/keys'
import { ApolloContext } from '../typings/context';


@Resolver()
export class UserResolver {
  @Query(() => User)
  async getUserByEmail(@Arg('email') email: string) {
    return await UserModel.findOne({ email });
  }

  @Query(() => Boolean)
  async login(@Arg('data') {email, password}: UserInput, @Ctx() {res}: ApolloContext ): Promise<Boolean>{
    const user = await UserModel.findOne({email})
    if (!user){
      throw new Error('We cannot find this user. Please check the email.')
    }
    const match = await bcrypt.compare(password as string, user?.password as string )
    if (!match) {
      throw new Error('Incorrect password. Please try again')
    }
    const token = jwt.sign({id: user.id, email: user.email}, keys.JWT_SECRET )
    res.cookie('jwt', token, {
      httpOnly: true,
      // secure: true
      // domain: 'website.com
    })
    console.log(res)
    return true
  }


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
      throw new Error('Something went wrong')
    }
    return user;
  }
}
