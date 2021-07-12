import { prop, modelOptions } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';

@modelOptions({ options: {allowMixed: 0}})
@ObjectType({ description: 'Links for character creation steps' })
export class LinkControl {
  @Field()
  @prop({ required: true })
  name!: String;
  @Field()
  @prop({ required: true })
  to!: String;
  @Field()
  @prop({ required: true, default: false })
  active!: Boolean;
}