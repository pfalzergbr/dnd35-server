import { ObjectType, ID, Field } from 'type-graphql';
import { prop, getModelForClass, mongoose } from '@typegoose/typegoose';
import { SkillModifiers } from './SkillModifiers';

@ObjectType({ description: 'Character Class model' })
export class CharacterClass {
  @Field(() => ID, { name: 'id' })
  @prop()
  _id!: mongoose.Types.ObjectId;

  @Field({ description: 'Name of the character class' })
  @prop({ required: true })
  className!: String;

  @Field({ description: 'Available alignments for the members of the class' })
  @prop({ required: true })
  alignments!: String[];

  @Field({ description: 'Type of magic used by the class' })
  @prop({ required: false, nullable: true })
  magicType!: String;
  // Change to ENUM

  @Field({
    description: 'Ability associated with the use of magic for this class',
  })
  @prop({ required: false, nullable: true })
  magicAbility!: String;
  // Change to ENUM

  @Field(() => SkillModifiers)
  @prop()
  skillModifiers!: SkillModifiers;

  @Field()
  @prop()
  classFeats!: Object[]
  // Think about this one, might not be needed. 
  
  @Field()
  @prop()
  levels!: Object[]
}

export const CharacterClassModel = getModelForClass(CharacterClass);
