import { mongoose, prop } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({description: 'Quick reference for the character race'})
export class CharacterRace {
  @Field(() => ID, { description: 'ObjectId of the character race' })
  @prop({ required: true })
  raceId!: mongoose.Types.ObjectId;

  @Field({ description: 'Name of the race for quick reference' })
  @prop({ required: true })
  raceName!: String;
}
