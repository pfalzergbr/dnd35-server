import {  prop } from '@typegoose/typegoose';
import { ObjectType, Field, } from 'type-graphql';


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

@ObjectType({ description: 'Current progress of character generation flow' })
export class CharCreationProgress {
  @Field()
  @prop({ required: true, default: '/create-character/choose-race' })
  nextLink!: String;

  @Field(() => [LinkControl])
  @prop({ required: true })
  links!: LinkControl[];
}