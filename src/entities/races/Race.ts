import { mongoose, prop, getModelForClass } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';
import { RaceLanguage } from './RaceLanguages';

@ObjectType()
export class Race {
  @Field(() => ID, { name: 'id' })
  @prop()
  _id!: mongoose.Types.ObjectId;

  @Field({ description: 'Name of the selectable character race' })
  @prop({ required: true })
  name!: String;

  @Field({ description: 'Description of the character race' })
  @prop({ required: true })
  //TODO
  description!: Object;

  @Field({ description: 'Average size of the characters from this race' })
  @prop({ required: true })
  size!: String;

  @Field({ description: 'Character base land speed' })
  @prop({ required: true })
  speed!: Number;

  @Field({ description: 'Favoured class for the individuals of the race' })
  @prop({ required: true })
  favouredClass!: String;

  @Field({ description: 'Racial modifiers for abilities, skills and feats' })
  @prop({ required: true })
  // TODO
  raceModifiers!: Object;

  @Field({ description: 'Special traits for the individuals of the race' })
  @prop({ required: true })
  // TODO
  specialTraits!: [];

  @Field(() => RaceLanguage, {
    description: 'Languages typically spoken by the race',
  })
  @prop({ required: true })
  languages!: RaceLanguage;
}

export const RaceModel = getModelForClass(Race);
