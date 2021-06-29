import { ObjectType, ID, Field } from 'type-graphql';
import { prop, getModelForClass, mongoose } from '@typegoose/typegoose';
import { SkillModifiers } from './SkillModifiers';
import { Level } from './Level';

@ObjectType({ description: 'Character Class model' })
export class CharacterClass {
  @Field(() => ID, { name: 'id' })
  @prop()
  _id!: mongoose.Types.ObjectId;

  @Field({ description: 'Name of the character class' })
  @prop({ required: true })
  className!: String;

  @Field(() => [String],{ description: 'Available alignments for the members of the class' })
  @prop({ required: true })
  alignments!: String[];

  @Field({description: 'Hitpoint die per level'})
  @prop({required: true})
  hitDie!: Number;

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

  @Field(() => SkillModifiers, {description: 'Skill information for the class'})
  @prop({required: true})
  skillModifiers!: SkillModifiers;
  
  @Field(() => [Level], { description: 'Level up chart for the class'})
  @prop({required: true})
  levels!: Level[]
}

export const CharacterClassModel = getModelForClass(CharacterClass);
