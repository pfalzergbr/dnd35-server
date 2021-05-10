import { ObjectType, Field } from 'type-graphql';
import { prop, getModelForClass } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@ObjectType({description: "User model"})
export class User extends TimeStamps {
  @Field()
  @prop({required: true})
  email!: String;

  @Field()
  @prop({required: true})
  password!: String;

}


export const UserModel = getModelForClass(User)