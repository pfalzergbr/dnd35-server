import { mongoose, prop, getModelForClass } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ObjectType, Field, ID } from 'type-graphql';
import { CharCreationProgress } from './CharCreationProgress';
import { CharacterRace } from './CharacterRace';
import { PhysicalStats } from './PhysicalStats';
import { UserModel} from '../users/User';
import { charCreationBaseLinks } from '../../utils/charCreationBaseLinks';


@ObjectType({ description: 'Base Character model' })
export class Character extends TimeStamps {
  @Field(() => ID, { name: 'id' })
  @prop()
  _id!: mongoose.Types.ObjectId;

  @Field(() => ID, { name: 'ownerId' })
  @prop({ required: true })
  ownerId!: mongoose.Types.ObjectId;

  @Field({ description: 'Name of the Character' })
  @prop({ required: true })
  name!: String;

  @Field({ description: 'Indication if the character is completed' })
  @prop({ required: true, default: false })
  isCompleted!: Boolean;

  @Field(() => CharCreationProgress, {
    description:
      'Character creation progress, and available links for navigating the flow',
  })
  @prop({ required: true }) 
  charCreationProgress!: CharCreationProgress;

  @Field(() => CharacterRace, {
    description: 'Quick reference for the character race',
  })
  @prop()
  characterRace!: CharacterRace;

  @Field(() => PhysicalStats, { description: 'Physical, computed stats of the character. AC, Init, Health and Speed'})
  @prop()
  physicalStats!: PhysicalStats


  public static async createCharacter(userId: string, characterName: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    const user = await UserModel.findOne({ _id: userId }).session(session);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.characters.length >=5 ){
      throw new Error("You have the maximum number of 5 characters. Delete one to add a new one")
    }
    const character = new CharacterModel({
      _id: mongoose.Types.ObjectId(),
      name: characterName,
      ownerId: userId,
      isCompleted: false,
      charCreationProgress: 
      { 
        nextLink: '/choose-race',
        links: charCreationBaseLinks
      }
    });
    const characterLink = {
      characterId: character._id,
      name: characterName,
      race: null,
      class: null,
      level: 1,
      isCompleted: false,
      nextLink: '/choose-race'
    };
    user.characters.push(characterLink);
    await character.save({ session: session });
    await user.save({ session: session });
    await session.commitTransaction();
    session.endSession();
    return character;
  }

  public async deleteCharacter(userId: string, characterId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    const user = await UserModel.findOne({ _id: userId }).session(session);
    if (!user) {
      throw new Error('User not found');
    }
    try {
      await CharacterModel.findOneAndDelete({ _id: characterId }).session(session);
    } catch (error) {
      throw new Error('Character not found')      
    }

    user.characters = user.characters.filter(
      character => characterId !== character.characterId.toString()
    );
    await user.save({ session });
    await session.commitTransaction();
    session.endSession;
    return characterId;
  }
}

export const CharacterModel = getModelForClass(Character);
