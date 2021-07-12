import { prop, modelOptions } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import { StatModifier } from './StatModifier';


@modelOptions({ options: { allowMixed: 0 } })
@ObjectType()
export class CharacterAbility {
  @Field({ description: 'Ability score for this particular ability' })
  @prop({ required: true })
  baseValue!: number;
  @Field({
    description: 'Ability modifier for rolls, coming from this ability',
  })
  @prop({ required: true })
  modifier!: number;
  @Field(() => [StatModifier], {
    description: 'Modifiers effecting this ability',
  })
  @prop({ required: false, nullable: true, default: [] as StatModifier[] })
  statModifiers!: StatModifier[];
}
