import { prop, modelOptions } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import { ModifierSource, ModifierType } from '../../typings/modifiers';

@modelOptions({ options: { allowMixed: 0 } })
@ObjectType()
export class StatModifier {
  @Field()
  @prop({required: true})
  modifierType!: ModifierType;

  @Field()
  @prop({required: true})
  modifierSource!: ModifierSource;

  @Field()
  @prop({required: true})
  modifierValue!: Number;
}