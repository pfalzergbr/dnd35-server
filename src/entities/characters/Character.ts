import { mongoose, prop, getModelForClass } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ObjectType, Field, ID } from 'type-graphql';
import { CharCreationProgress } from './CharCreationProgress';



@ObjectType({ description: 'Base Character model' })
export class Character extends TimeStamps {
  @Field(() => ID, { name: 'id' })
  @prop()
  _id!: mongoose.Types.ObjectId;

  @Field(() => ID, { name: 'ownerId' })
  @prop({ required: true })
  ownerId!: mongoose.Types.ObjectId;

  @Field({ description: 'Name of the Character' })
  @prop({ required: true })
  name!: String;

  @Field({ description: 'Indication if the character is completed' })
  @prop({ required: true, default: false })
  isCompleted!: Boolean;

  @Field(() => CharCreationProgress, { description: 'Character creation progress, and available links for navigating the flow' } )
  @prop({required: true})
  @prop()
  charCreationProgress!: CharCreationProgress;
}

export const CharacterModel = getModelForClass(Character);
