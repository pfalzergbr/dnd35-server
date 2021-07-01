import { ObjectType, Field, ID } from 'type-graphql';
import { prop, getModelForClass, mongoose } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { CharacterLink } from './CharacterLink';
import { ClientSession } from 'mongoose';

@ObjectType({ description: 'User model' })
export class User extends TimeStamps {
  @Field(() => ID, { name: 'id' })
  @prop()
  _id!: mongoose.Types.ObjectId;

  @Field()
  @prop({ required: true, unique: true })
  email!: String;

  @prop({ required: true })
  password!: String;

  @Field(() => [CharacterLink])
  @prop({ required: true, default: [] })
  characters!: CharacterLink[];

  public static async findUser(id: string) {
    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }


  public async updateCharacterLinks(
    characterId: mongoose.Types.ObjectId,
    update: {
      key: 'class' | 'race';
      value: string;
    } | null,
    links: {
      currentLink: string;
      nextLink: string;
    },
    session: ClientSession
  ) {
    const updatedCharacters = this.characters.map((character) => {
      if (characterId.toString() === character.characterId.toString()) {
        if (update) character[update.key] = update.value;
        if (character.nextLink === links.currentLink)
          character.nextLink = links.nextLink;
      }
      return character;
    });

    await UserModel.updateOne(
      { _id: this._id },
      { characters: updatedCharacters }
    ).session(session);
    return this;
  }
}

export const UserModel = getModelForClass(User);
