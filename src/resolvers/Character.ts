import { Mutation, Query, Resolver, Ctx, Arg } from 'type-graphql';
import { mongoose } from '@typegoose/typegoose';
import { CharacterClassModel } from '../entities/characterClasses/CharacterClass';
import { Character, CharacterModel } from '../entities/characters/Character';
import {
  AbilityInput,
  CharacterInput,
} from '../entities/characters/character-inputs';
import { RaceModel } from '../entities/races/Race';
import { UserModel } from '../entities/users/User';
import { ApolloContext } from '../typings/context';

@Resolver()
export class CharacterResolver {
  @Query(() => Character)
  async getCharacterById(@Arg('id') id: string, @Ctx() { req }: ApolloContext) {
    if (!req.user) {
      throw new Error('Unauthorized. Please log in to create a character');
    }
    const character = await CharacterModel.findCharacter(id, req.user.id);
    return character;
  }

  @Mutation(() => Character)
  async createCharacter(
    @Arg('characterData') { name }: CharacterInput,
    @Ctx() { req }: ApolloContext
  ) {
    if (!req.user) {
      throw new Error('Unauthorized. Please log in to create a character');
    }
    try {
      const character = await CharacterModel.createCharacter(
        req.user.id,
        name as string
      );
      return character;
    } catch (error) {
      throw new Error('Something went wrong. Please try again.');
    }
  }

  @Mutation(() => String)
  async deleteCharacter(@Arg('id') id: string, @Ctx() { req }: ApolloContext) {
    if (!req.user) {
      throw new Error('Unauthorized. Please log in.');
    }
    try {
      CharacterModel.deleteCharacter(req.user.id, id);
      return id;
    } catch (error) {
      throw new Error('Error. Character cannot be deleted. Please try again.');
    }
  }

  @Mutation(() => Character)
  async chooseRace(
    @Arg('characterId') characterId: string,
    @Arg('raceId') raceId: string,
    @Ctx() { req }: ApolloContext
  ) {
    if (!req.user) {
      throw new Error('Unauthorized. Please log in.');
    }
    try {
      const user = await UserModel.findUser(req.user.id);
      const race = await RaceModel.findRace(raceId);
      const character = await CharacterModel.findCharacter(
        characterId,
        req.user.id
      );

      await character.chooseRace(user, race);
      return character;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Mutation(() => Character)
  async chooseClass(
    @Arg('characterId') characterId: string,
    @Arg('classId') classId: string,
    @Ctx() { req }: ApolloContext
  ) {
    if (!req.user) {
      throw new Error('Unauthorized. Please log in.');
    }
    try {
      const user = await UserModel.findUser(req.user.id);
      const charClass = await CharacterClassModel.findCharacterClass(classId);
      const character = await CharacterModel.findCharacter(
        characterId,
        req.user.id
      );

      await character.chooseClass(user, charClass);
      return character;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Mutation(() => Character)
  async setInitialAbilities(
    @Arg('characterId') characterId: string,
    @Arg('abilityValues') abilityInput: AbilityInput,
    @Ctx() { req }: ApolloContext
  ) {
    if (!req.user) {
      throw new Error('Unauthorized. Please log in.');
    }
    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await UserModel.findUser(req.user.id);
    const character = await CharacterModel.findCharacter(
      characterId,
      req.user.id
    );
    await character.setBaseAbilities(abilityInput, user, session);
    await character.save({session});
    await session.commitTransaction();
    session.endSession;
    return character;

  }
}
