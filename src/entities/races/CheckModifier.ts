import { prop} from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class CheckModifier {
  @Field()
  @prop()
  name!: String;

  @Field()
  @prop()
  description!: String;
  
  @Field(() => [String])
  @prop()
  fields!: String[]

  @Field()
  @prop()
  modifier!: Number;
}