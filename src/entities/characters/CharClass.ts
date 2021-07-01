import { mongoose, prop} from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class CharClass {
  @Field(() => ID, {description: 'Reference to the character class entity'})
  @prop({required: true})
  classId!: mongoose.Types.ObjectId;

  @Field({description: 'Name of the chosen class'})
  @prop({required: true})
  className!: String;

  @Field({description: 'Level of the current class'})
  @prop({required: true})
  classLevel!: String;

  @Field({description: 'Is this a favoured class for the character?'})
  @prop()
  isFavoured!: Boolean;
}