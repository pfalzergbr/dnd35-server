import { prop } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class RaceDescription {
  @Field({description: 'Brief description of the race'})
  @prop({required: true})
  raceDescription!: String; 

  @Field(() => [String])
  @prop()
  generalTraits!: String[]; 

  @Field(() => [String])
  @prop()
  checksAndSaves!: String[]; 
}