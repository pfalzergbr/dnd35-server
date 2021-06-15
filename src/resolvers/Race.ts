import { Resolver, Query, Ctx, Arg } from "type-graphql";
import { Race, RaceModel } from '../entities/races/Race';
import { ApolloContext } from '../typings/context';

@Resolver()
export class RaceResolver {
  @Query(() => [Race] ) 
  async getAllRaces(
    @Ctx() { req }: ApolloContext
  ){
    if (!req.user) {
      throw new Error('Unauthorized. Please log in to see the available races')
    }
    try {
      const races = await RaceModel.find()
      return races;
    } catch (error) {
      throw new Error('Cannot fetch character races. Please try again.')
    }
  }

  @Query(() => Race)
  async getRaceById(
    @Arg('id') id : string,
    @Ctx() { req }: ApolloContext
  ){
    if (!req.user) {
      throw new Error('Unauthorized. Please log in to see the available races')
    }
    try {
      const race = await RaceModel.findOne({_id: id})
      return race;
    } catch (error) {
      throw new Error('Cannot find this character race')
    }
  }
}