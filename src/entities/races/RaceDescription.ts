import { prop } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import { SpecialTrait } from './SpecialTrait';


@ObjectType()
export class RaceDescription {
  @Field({description: 'Brief description of the race'})
  @prop({required: true})
  raceDescription!: String; 

  @Field(() => [SpecialTrait])
  @prop()
  generalTraits!: SpecialTrait[]

  @Field(() => [String])
  @prop()
  checksAndSaves!: String[]; 
}