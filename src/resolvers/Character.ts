import { mongoose } from '@typegoose/typegoose';
import { Mutation, Query, Resolver, Ctx, Arg } from 'type-graphql';
import { Character, CharacterModel } from '../entities/characters/Character';
import { CharacterInput } from '../entities/characters/character-inputs';
import { CharacterRace } from '../entities/characters/CharacterRace';
import { RaceModel } from '../entities/races/Race';
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
      const session = await mongoose.startSession();
      session.startTransaction();

      const character = await CharacterModel.findOne({_id: characterId, ownerId: req.user.id}).session(session)
      const race = await RaceModel.findOne({_id: raceId}).session(session)
      if (character && race ){
        const characterRace: CharacterRace = {
          raceId: race._id, raceName: race.name
        }
        character.characterRace = characterRace
// TODO
      } else {
        throw new Error('Data is missing. Please try again.')
      }

//TODO

      console.log(race)
//TODO
      return character
    } catch (error) {
      throw new Error('Something went wrong. Please try again')
    }
  }
  

}
