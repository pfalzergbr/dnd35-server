import { mongoose } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Resolver, Query, Arg, Mutation, Ctx } from 'type-graphql';
import { User, UserModel } from '../entities/User';
import { UserInput } from '../entities/user-input';
import keys from '../config/keys'
import { ApolloContext } from '../typings/context';


const cookieOptions = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 * 7,
  secure: process.env.NODE_ENV === 'production'
  // domain: 'website.com
}

@Resolver()
export class UserResolver {
  @Query(() => User)
  async getUserByEmail(@Arg('email') email: string, @Ctx() {req}: ApolloContext ) {
    console.log('user: ', req.user)
    return await UserModel.findOne({ email });
  }

  @Query(() => User)
  async login(@Arg('data') {email, password}: UserInput, @Ctx() {res}: ApolloContext ): Promise<User>{
    const user = await UserModel.findOne({email})
    if (!user){
      throw new Error('We cannot find this user. Please check the email.')
    }
    const match = await bcrypt.compare(password as string, user?.password as string )
    if (!match) {
      throw new Error('Incorrect password. Please try again')
    }
    const token = jwt.sign({id: user.id, email: user.email}, keys.JWT_SECRET, {expiresIn: "7d"} )
    res.cookie('jwt', token, cookieOptions)
    return user
  }


  @Mutation(() => User)
  async createUser(@Arg('data') { email, password }: UserInput, @Ctx() {res}: ApolloContext): Promise<User> {
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
    const token = jwt.sign({id: user.id, email: user.email}, keys.JWT_SECRET, {expiresIn: "7d"} )
    res.cookie('jwt', token, cookieOptions)
    return user;
  }
}
