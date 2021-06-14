import { mongoose, prop } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class AbilityModifier {
  @Field({ description: 'Name of the ability to modify' })
  @prop()
  abilityName!: String;
  
  @Field({ description: 'Value the ability is modified by' })
  @prop()
  value!: Number;
}

@ObjectType()
export class SkillModifier {
  @Field({ description: 'Extra skill points on the first level.' })
  @prop()
  extraStartingSkillPoint!: Number

  @Field({ description: 'Extra skill points per new level' })
  @prop()
  extraLevelSkillPoint!: Number
}

@ObjectType()
export class FeatModifier {
  @Field({ description: 'Name of the extra feat' })
  @prop()
  featName!: String
 
  @Field({ description: 'ObjectId if the extra feat for more efficient writes' })
  @prop()
  featId!: mongoose.Types.ObjectId
}

@ObjectType()
export class RaceModifiers {
  @Field(() => [AbilityModifier], { description: 'List of ability modifiers' })
  @prop({ required: true })
  abilityModifiers!: AbilityModifier[];

  @Field(() => SkillModifier, { description: 'Skillpoint modifiers' })
  @prop({ required: true })
  skillModifiers!: SkillModifier;

  @Field(() => [FeatModifier], { description: 'List of extra feats the characters get with this race'})
  @prop({ required: true })
  featModifiers!:FeatModifier[];
}
