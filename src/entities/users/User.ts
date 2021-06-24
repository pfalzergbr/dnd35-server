import { ObjectType, Field, ID } from 'type-graphql';
import { prop, getModelForClass, mongoose } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { CharacterLink } from './CharacterLink'

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

  public static async findUser(id: string){
    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

export const UserModel = getModelForClass(User);
