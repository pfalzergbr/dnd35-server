import { ObjectType, Field } from 'type-graphql';
import { prop, modelOptions } from '@typegoose/typegoose';

@modelOptions({ options: {allowMixed: 0}})
@ObjectType({ description: 'Information about the skills of this class' })
export class SkillModifiers {
  @Field(() => [String], { description: 'List of class skills' })
  @prop({ required: true })
  classSkills!: String[];

  @Field({ description: 'Skill points on the first level' })
  @prop({ required: true })
  startingSkillPoints!: Number;

  @Field({ description: 'Skill points on level-up' })
  @prop({ required: true })
  levelSkillPoints!: Number;
}
