import { Arg, Ctx, Resolver, Query } from 'type-graphql';
import {
  CharacterClass,
  CharacterClassModel,
} from '../entities/characterClasses/CharacterClass';
import { ApolloContext } from '../typings/context';

@Resolver()
export class CharacterClassResolver {
  @Query(() => [CharacterClass])
  async getAllClasses(@Ctx() { req }: ApolloContext) {
    if (!req.user) {
      throw new Error(
        'Unauthorized. Please log in to see the available classes'
      );
    }
    try {
      const characterClasses = await CharacterClassModel.find();
      return characterClasses;
    } catch (error) {
      throw new Error('Cannot fetch character classes. Please try again.');
    }
  }

  @Query(() => CharacterClass)
  async getRaceById(@Arg('id') id: string, @Ctx() { req }: ApolloContext) {
    if (!req.user) {
      throw new Error('Unauthorized. Please log in to see the available races');
    }
    try {
      const characterClass = await CharacterClassModel.findOne({ _id: id });
      return characterClass;
    } catch (error) {
      throw new Error('Cannot find this character class');
    }
  }
}
