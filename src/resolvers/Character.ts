// import { mongoose } from '@typegoose/typegoose';
import { Mutation, Query, Resolver, Ctx, Arg } from 'type-graphql';
import { Character, CharacterModel } from '../entities/characters/Character';
import { CharacterInput } from '../entities/characters/character-inputs';
// import { CharacterRace } from '../entities/characters/CharacterRace';
// import { RaceModel } from '../entities/races/Race';
import { ApolloContext } from '../typings/context';

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
    try {
      const character = await CharacterModel.createCharacter(req.user.id, name as string);
      return character;
    } catch (error) {
      throw new Error("Something went wrong. Please try again.")
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
      throw new Error('Error. Character cannot be deleted. Please try again.')
    }
  }

  @Mutation(() => Character)
  async chooseRace(
    @Arg('characterId') characterId: string,
    @Arg('raceId') raceId: string,
    @Ctx() { req }: ApolloContext
  ){
    if (!req.user) {
      throw new Error('Unauthorized. Please log in.');
    }
    try {
      const character = await CharacterModel.chooseRace(req.user.id, characterId, raceId);
      return character;  
    } catch (error) {
      throw new Error(error);
      // console.log(error)
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
      const character = await CharacterModel
    } catch (error) {
      throw new Error(error);
    }
  }

}
