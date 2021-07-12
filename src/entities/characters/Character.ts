import {
  mongoose,
  prop,
  modelOptions,
  getModelForClass,
  DocumentType,
} from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ObjectType, Field, ID } from 'type-graphql';
import { CharCreationProgress } from './CharCreationProgress';
import { CharacterRace } from './CharacterRace';
import { PhysicalStats } from './PhysicalStats';
import { UserModel, User } from '../users/User';
import { Race } from '../races/Race';
import { charCreationBaseLinks } from '../../utils/charCreationBaseLinks';
import { CharClass } from './CharClass';
import { CharacterClass } from '../characterClasses/CharacterClass';
import { AbilitiesModel, CharacterAbilities } from './CharacterAbilities';
import { AbilityInput } from './character-inputs';


@modelOptions({ options: { allowMixed: 0 } })
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

  @Field(() => [CharClass], { description: 'Chosen classes for the character' })
  @prop({ nullable: true })
  characterClass!: CharClass[];

  @Field(() => CharacterAbilities, { description: 'Ability stats of the character'})
  //flip this once functionality is complete
  @prop({nullable: true})
  characterAbilities!:CharacterAbilities;

  @Field(() => PhysicalStats, {
    description:
      'Physical, computed stats of the character. AC, Init, Health and Speed',
  })
  @prop()
  physicalStats!: PhysicalStats;

  public static async findCharacter(id: string, ownerId: string) {
    const character = await CharacterModel.findOne({ _id: id, ownerId });
    if (!character) {
      throw new Error('Character not found');
    }
    return character;
  }

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

    character.initializeAbilities();
    console.log('still running')
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

  private setRace(race: DocumentType<Race>) {
    this.characterRace = {
      raceId: race._id,
      raceName: race.name,
    };
    return this;
  }

  private initializeAbilities() {
    const baseAbility = {
      baseValue: 0,
      modifier: 0,
      statModifiers: []
    }

    this.characterAbilities = new AbilitiesModel({
      strength: baseAbility,
      dexterity: baseAbility,
      constitution: baseAbility,
      intelligence: baseAbility,
      charisma: baseAbility,
      wisdom: baseAbility,
    })
  }

  // Flip this private and abstract away once working
  public setAbilities(abilityValues: AbilityInput) {
    this.characterAbilities.setAbilities(abilityValues)
  }

  private setProgress(nextLink: string) {
    this.charCreationProgress.nextLink = nextLink;
    const newLinks = this.charCreationProgress.links.map((link) =>
      link.to === nextLink ? { ...link, active: true } : { ...link }
    );
    this.charCreationProgress.links = newLinks;
  }

  private chooseFirstClass(characterClass: DocumentType<CharacterClass>) {
    this.characterClass = [
      {
        classId: characterClass._id,
        className: characterClass.name,
        classLevel: 1,
        isFavoured: false,
      },
    ];
    // TODO - handle favoured class!

    return this;
  }

  public async chooseRace(
    this: DocumentType<Character>,
    user: DocumentType<User>,
    race: DocumentType<Race>
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    this.setRace(race);
    this.setProgress('/choose-class');
    await user.updateCharacterLinks(
      this._id,
      {
        key: 'race',
        value: race.name.toString(),
      },
      {
        currentLink: '/choose-race',
        nextLink: '/choose-class',
      },
      session
    );
    await this.save({ session });

    await session.commitTransaction();
    session.endSession;
    return this;
  }

  public async chooseClass(
    this: DocumentType<Character>,
    user: DocumentType<User>,
    characterClass: DocumentType<CharacterClass>
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    this.chooseFirstClass(characterClass);

    this.setProgress('/abilities');
    await user.updateCharacterLinks(
      this._id,
      {
        key: 'class',
        value: characterClass.name.toString(),
      },
      {
        currentLink: '/choose-class',
        nextLink: '/abilities',
      },
      session
    );
    await this.save({ session });

    await session.commitTransaction();
    session.endSession;
    return this;
  }
}

export const CharacterModel = getModelForClass(Character);
