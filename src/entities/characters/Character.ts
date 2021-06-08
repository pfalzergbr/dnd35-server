import { mongoose, prop, getModelForClass } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ObjectType, Field, ID } from 'type-graphql';


ObjectType({description: 'Links for character creation steps'})
export class LinkControl {
  @Field()
  @prop({required: true})
  name!: String
  @Field()
  @prop({required: true})
  to!: String
  @Field()
  @prop({required: true, default: false})
  active!: Boolean
}


ObjectType({ description: 'Current progress of character generation flow'})
export class CharCreationProgress {
  @Field()
  @prop({required: true, default: '/create-character/choose-race'})
  nextLink!: String

  @Field(() => [LinkControl])
  @prop({required: true})
  links!: LinkControl[]
}


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

  // @Field(() => CharCreationProgress)
  // @prop({required: true})
  // charCreationProgress!: CharCreationProgress

}

export const CharacterModel = getModelForClass(Character);
