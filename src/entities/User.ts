import { ObjectType, Field, ID } from 'type-graphql';
import { prop, getModelForClass, mongoose } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@ObjectType({description: "User model"})
export class User extends TimeStamps {
  @Field(() => ID, { name: 'id' })
  @prop()
  _id!: mongoose.Types.ObjectId

  @Field()
  @prop({required: true})
  email!: String;

  // @Field()
  @prop({required: true})
  password!: String;

}


export const UserModel = getModelForClass(User)