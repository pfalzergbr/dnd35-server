import { prop, modelOptions } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import { StatModifier } from './StatModifier';

@modelOptions({ options: { allowMixed: 0 } })
@ObjectType()
export class Health {
  @Field({ description: 'The characters maximum health' })
  @prop()
  maximumHealth!: Number;

  @Field({ description: 'The characters actual health' })
  @prop()
  actualHealth!: Number;

  @Field({ description: 'Health point die per level' })
  @prop()
  healthPerLevel!: Number;

  @Field(() => [StatModifier], { description: 'Health point die per level' })
  @prop()
  healthModifiers!: StatModifier[];
}

@modelOptions({ options: { allowMixed: 0 } })
@ObjectType()
export class Initiative {
  @Field({ description: 'Total Initiative of the Character' })
  @prop()
  totalInitiative!: Number;

  @Field({ description: 'Base Initiative of the Character' })
  @prop()
  baseInitiative!: Number;

  @Field(() => [StatModifier], { description: 'Array of initiative modifiers' })
  @prop()
  initiativeModifiers!: StatModifier[];
}

@modelOptions({ options: { allowMixed: 0 } })
@ObjectType()
export class Speed {
  @Field({ description: 'Total land speed of the character' })
  @prop()
  totalSpeed!: Number;

  @Field({ description: 'Base land speed of the character' })
  @prop()
  baseSpeed!: Number;

  @Field(() => [StatModifier], { description: 'Array of speed modifiers' })
  @prop()
  speedModifiers!: StatModifier[];
}

@modelOptions({ options: { allowMixed: 0 } })
@ObjectType()
export class ArmorClass {
  @Field({ description: 'Total Armor Class' })
  @prop()
  totalAC!: Number;

  @Field({ description: 'Base Armor Class' })
  @prop()
  baseAC!: Number;

  @Field(() => [StatModifier], {
    description: 'Array of Armor Class Modifiers',
  })
  @prop()
  ACModifiers!: StatModifier[];
}

@modelOptions({ options: { allowMixed: 0 } })
@ObjectType()
export class PhysicalStats {
  @Field(() => Health, {
    description: 'Current and maximum health of the Character',
  })
  @prop()
  health!: Health;

  @Field(() => Initiative, { description: 'Characters Initiative value' })
  @prop()
  initiative!: Initiative;

  @Field(() => Speed, { description: 'Characters Initiative value' })
  @prop()
  speed!: Speed;
}
