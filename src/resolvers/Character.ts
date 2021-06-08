import { mongoose } from '@typegoose/typegoose';
import { Mutation, Query, Resolver, Ctx, Arg } from 'type-graphql';
import { Character, CharacterModel } from '../entities/characters/Character';
import { CharacterInput } from '../entities/characters/character-inputs';
import { UserModel } from '../entities/users/User';
import { ApolloContext } from '../typings/context';
import { charCreationBaseLinks } from '../utils/charCreationBaseLinks';

@Resolver()
export class CharacterResolver {
  @Query(() => Character)
  async getCharacterById(
    @Arg('id') id : string,
    @Ctx() { req }: ApolloContext
  ) {
    if (!req.user) {
      throw new Error('Unauthorized. Please log in to create a character');
    }
    const character = await CharacterModel.findOne({_id: id, ownerId: req.user.id})
    return character
  }

  @Mutation(() => Character)
  async createCharacter(
    @Arg('characterData') { name }: CharacterInput,
    @Ctx() { req }: ApolloContext
  ) {
    if (!req.user) {
      throw new Error('Unauthorized. Please log in to create a character');
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    const user = await UserModel.findOne({ _id: req.user.id }).session(session);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.characters.length >=5 ){
      throw new Error("You have the maximum number of 5 characters. Delete one to add a new one")
    }
    const character = new CharacterModel({
      _id: mongoose.Types.ObjectId(),
      name,
      ownerId: req.user.id,
      isCompleted: false,
      charCreationProgress: 
      { 
        nextLink: '/choose-race',
        links: charCreationBaseLinks
      }
    });
    const characterLink = {
      characterId: character._id,
      name,
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

  @Mutation(() => String)
  async deleteCharacter(@Arg('id') id: string, @Ctx() { req }: ApolloContext) {
    if (!req.user) {
      throw new Error('Unauthorized. Please log in.');
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    const user = await UserModel.findOne({ _id: req.user.id }).session(session);
    if (!user) {
      throw new Error('User not found');
    }
    try {
      await CharacterModel.findOneAndDelete({ _id: id }).session(session);
    } catch (error) {
      throw new Error('Character not found')      
    }
    console.log(mongoose.Types.ObjectId(id), user.characters[0].characterId)
    user.characters = user.characters.filter(
      character => id !== character.characterId.toString()
    );
    await user.save({ session });
    await session.commitTransaction();
    session.endSession;
    return id;
  }
}
