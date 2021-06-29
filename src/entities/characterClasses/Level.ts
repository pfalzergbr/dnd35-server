import { ObjectType, Field } from 'type-graphql';
import { prop } from '@typegoose/typegoose';

@ObjectType()
export class SaveBonuses {
  @Field({description: 'Fortitude Saving Throw Bonus'})
  @prop({required: true})
  fortBonus!: Number;

  @Field({description: 'Reflex Saving Throw Bonus'})
  @prop({required: true})
  refBonus!: Number;
  
  @Field({description: 'Will Saving Throw Bonus'})
  @prop({required: true})
  willBonus!: Number;
}

@ObjectType()
export class ClassSpells {
  // Might need rework for domains and schools to be more granular
  @Field(() => [Number], {description: 'Spells per day on each spell level', nullable: true})
  @prop({required: false})
  spellsPerDay!: Number[];
  
  @Field(() => [Number], {description: 'Spells per day on each spell level', nullable: true})
  @prop({required: false})
  spellsKnown!: Number[]
}


@ObjectType({description: 'Level up information'})
export class Level {
  @Field({description: 'Number of the level'})
  @prop({required: true})
  level!: Number;

  @Field(() => [Number], {description: 'List of attack bonuses on this level'})
  @prop({required: true})
  attackBonus!: [Number];

  @Field(() => SaveBonuses, {description: 'Saving throw bonuses on this level'})
  @prop({required: true})
  saveBonuses!: SaveBonuses;
  
  @Field(() => [String], {description: 'Special feats gained this level', nullable: true})
  @prop({required: false})
  specialFeats!: String[]
  //Specify here once we have a feat template

  @Field(() => ClassSpells, {description: 'Spell information for the current level', nullable: true})
  @prop({required: false})
  classSpells!: ClassSpells;

  @Field(() => [String], {description: "Spell like abilities gained on this level", nullable: true})
  @prop({required: false})
  spellLikeAbilities!: String[]
}