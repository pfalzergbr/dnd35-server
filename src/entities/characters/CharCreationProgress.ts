import { prop, modelOptions } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import { LinkControl } from './LinkControl';

@modelOptions({ options: {allowMixed: 0}})
@ObjectType({ description: 'Current progress of character generation flow' })
export class CharCreationProgress {
  @Field()
  @prop({ required: true, default: '/choose-race' })
  nextLink!: String;

  @Field(() => [LinkControl])
  @prop({ required: true })
  links!: LinkControl[];
}
