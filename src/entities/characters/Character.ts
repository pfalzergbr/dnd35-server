import { mongoose, prop, getModelForClass, DocumentType} from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ObjectType, Field, ID } from 'type-graphql';
import { CharCreationProgress } from './CharCreationProgress';
import { CharacterRace } from './CharacterRace';
import { PhysicalStats } from './PhysicalStats';
import { UserModel, User} from '../users/User';
import { Race } from '../races/Race';
// import { CharacterClassModel } from '../characterClasses/CharacterClass';
import { charCreationBaseLinks } from '../../utils/charCreationBaseLinks';
import { CharClass } from './CharClass';

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

  @Field(() => [CharClass], {description: 'Chosen classes for the character'})
  @prop({nullable: true})
  characterClass!: CharClass[] ;


  @Field(() => PhysicalStats, {
    description:
      'Physical, computed stats of the character. AC, Init, Health and Speed',
  })
  @prop()
  physicalStats!: PhysicalStats;

  public static async createCharacter(userId: string, characterName: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    const user = await UserModel.findUser(userId);
    if (user.characters.length >= 5) {
      throw new Error(
        'You have the maximum number of 5 characters. Delete one to add a new one'
      );
    }
    const character = new CharacterModel({
      _id: mongoose.Types.ObjectId(),
      name: characterName,
      ownerId: userId,
      isCompleted: false,
      charCreationProgress: {
        nextLink: '/choose-race',
        links: charCreationBaseLinks,
      },
    });
    const characterLink = {
      characterId: character._id,
      name: characterName,
      race: null,
      class: null,
      level: 1,
      isCompleted: false,
      nextLink: '/choose-race',
    };
    user.characters.push(characterLink);
    await character.save({ session: session });
    await user.save({ session: session });
    await session.commitTransaction();
    session.endSession();
    return character;
  }

  public static async deleteCharacter(
    userId: string,
    characterId: string
  ): Promise<string> {
    const session = await mongoose.startSession();
    session.startTransaction();
    const user = await UserModel.findUser(userId);
    try {
      await CharacterModel.findOneAndDelete({ _id: characterId }).session(
        session
      );
    } catch (error) {
      throw new Error('Character not found');
    }

    user.characters = user.characters.filter(
      (character) => characterId !== character.characterId.toString()
    );
    await user.save({ session });
    await session.commitTransaction();
    session.endSession;
    return characterId;
  }

  private async setProgress(nextLink: string) {
    this.charCreationProgress.nextLink = nextLink;
    const newLinks = this.charCreationProgress.links.map(link => link.to === nextLink ? {...link, active: true} : {...link})
    this.charCreationProgress.links = newLinks;

  }

  // Refactor to non-static method later. Check if it works like this though.
  public async chooseRace(this: DocumentType<Character>, user: DocumentType<User>, race: DocumentType<Race>) {
    const session = await mongoose.startSession();
    session.startTransaction();

    this.characterRace = {
      raceId: race._id,
      raceName: race.name,
    };
    this.setProgress('/choose-class');

    const updatedUser = await user.updateCharacterLinks(this._id, race.name.toString(), '/choose-race', '/choose-class', session)
    console.log(updatedUser)
    await this.save({ session });

    await session.commitTransaction();
    session.endSession;
    return this;
  }









  // public static async chooseClass(userId: string, characterId: string, classId: string){
  //   const session = await mongoose.startSession();
  //   session.startTransaction();

  //   //This block could probably be removed.
  //   const user = await UserModel.findOne({ _id: userId }).session(session);
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   // This might be simplified as well
  //   const character = await CharacterModel.findOne({
  //     _id: characterId,
  //     ownerId: userId,
  //   }).session(session);

  //   if (!character) throw new Error('Error. Character not found.');
  //   const characterClass = await CharacterClassModel.findOne({ _id: classId }).session(session);
  //   if (!characterClass) throw new Error('Error, Race not found.');

  //   // const characterClass: CharacterClass = {
  //   //   raceId: race._id,
  //   //   raceName: race.name,
  //   // };
  // }
}

export const CharacterModel = getModelForClass(Character);
