import { mongoose, prop, getModelForClass } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';
import { RaceLanguage } from './RaceLanguages';
import { CheckModifier } from './CheckModifier';
import { RaceModifiers } from './RaceModifiers';
import { SpecialTrait } from './SpecialTrait';

@ObjectType()
export class Race {
  @Field(() => ID, { name: 'id' })
  @prop()
  _id!: mongoose.Types.ObjectId;

  @Field({ description: 'Name of the selectable character race' })
  @prop({ required: true })
  name!: String;

  @Field({description: 'Brief description of the race'})
  @prop({required: true})
  description!: String; 

  @Field({ description: 'Average size of the characters from this race' })
  @prop({ required: true })
  size!: String;

  @Field({ description: 'Character base land speed' })
  @prop({ required: true })
  speed!: Number;

  @Field(() => [SpecialTrait], {description: "Special racial traits", nullable: true})
  @prop({ required: false })
  generalTraits!: SpecialTrait[]

  @Field(() => [CheckModifier], {description: 'Check and save modifiers coming from this race', nullable: true})
  @prop({ required: false })
  checksAndSaves!: CheckModifier[]; 

  @Field({ description: 'Favoured class for the individuals of the race' })
  @prop({ required: true })
  favouredClass!: String;

  @Field(() => RaceModifiers, { description: 'Racial modifiers for abilities, skills and feats' })
  @prop({ required: true })
  raceModifiers!: RaceModifiers;

  @Field(() => RaceLanguage, {
    description: 'Languages typically spoken by the race',
  })
  @prop({ required: true })
  languages!: RaceLanguage;

  public static async findRace(id: string){
    const race = await RaceModel.findOne({ _id: id });
    if (!race) {
      throw new Error('Race not found');
    }
    return race;
  }
}

export const RaceModel = getModelForClass(Race);
