import { mongoose, prop, getModelForClass } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType({ description: 'Base Character model' })
export class Character extends TimeStamps {
  @Field(() => ID, { name: 'id' })
  @prop()
  _id!: mongoose.Types.ObjectId;

  @Field(() => ID, { name: 'ownerId' })
  @prop({ required: true })
  ownerId!: mongoose.Types.ObjectId;

  @Field()
  @prop({ required: true })
  name!: String;

  @Field()
  @prop({ required: true, default: false })
  isCompleted!: Boolean;
}

export const CharacterModel = getModelForClass(Character);
