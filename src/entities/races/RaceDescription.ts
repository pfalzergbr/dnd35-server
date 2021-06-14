import { prop } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class RaceDescription {
  @Field()
  @prop()
  raceDescription!: String; 

  @Field(() => [String])
  @prop()
  generalTraits!: String[]; 

  @Field(() => [String])
  @prop()
  checksAndSaves!: String[]; 
}