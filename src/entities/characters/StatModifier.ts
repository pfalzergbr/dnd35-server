import { prop, modelOptions } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';

@modelOptions({ options: { allowMixed: 0 } })
@ObjectType()
export class StatModifier {
  @Field()
  @prop({required: true})
  modifierType!: String;

  @Field()
  @prop({required: true})
  modifierValue!: Number;
}