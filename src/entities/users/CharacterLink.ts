import { ObjectType, Field, ID } from 'type-graphql';
import { prop, mongoose } from '@typegoose/typegoose';

@ObjectType({ description: 'Short character reference on user object' })
export class CharacterLink {
  @Field(() => ID)
  @prop({ required: true })
  characterId!: mongoose.Types.ObjectId;

  @Field()
  @prop({ required: true })
  name!: String;

  @Field(() => String, {nullable: true})
  @prop()
  race!: String | null;

  @Field(() => String, {nullable: true})
  @prop()
  class!: String | null; 

  @Field()
  @prop({required: true, default: 1})
  level!: Number;

  @Field()
  @prop({required: true, default: false})
  isCompleted!: Boolean;

  @Field()
  @prop({ required: true, default: '/choose-race' })
  nextLink!: String;
}
