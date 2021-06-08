import { ObjectType, Field, ID } from 'type-graphql';
import { prop, getModelForClass, mongoose } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@ObjectType({ description: 'Short character reference on user object' })
export class CharacterLink {
  @Field(() => ID)
  @prop({ required: true })
  characterId!: mongoose.Types.ObjectId;

  @Field()
  @prop({ required: true })
  name!: String;

  @Field(() => String, {nullable: true})
  @prop()
  race!: String | null;

  @Field(() => String, {nullable: true})
  @prop()
  class!: String | null; 

  @Field()
  @prop({required: true, default: 1})
  level!: Number;

  @Field()
  @prop({required: true, default: false})
  isCompleted!: Boolean;
}

@ObjectType({ description: 'User model' })
export class User extends TimeStamps {
  @Field(() => ID, { name: 'id' })
  @prop()
  _id!: mongoose.Types.ObjectId;

  @Field()
  @prop({ required: true, unique: true })
  email!: String;

  // @Field()
  @prop({ required: true})
  password!: String;

  @Field(() => [CharacterLink])
  @prop({ required: true, default: [] })
  characters!: CharacterLink[];
}

export const UserModel = getModelForClass(User);
