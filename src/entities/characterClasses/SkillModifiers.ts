import { ObjectType, Field } from 'type-graphql';
import { prop } from '@typegoose/typegoose';

@ObjectType({description: 'Information about the skills of this class'})
export class SkillModifiers {
  @Field({description: 'List of class skills'})
  @prop()
  classSkills!: String[]

  
  @Field({description: 'Skill points on the first level'})
  @prop()
  startingSkillPoints!: Number;

  @Field({description: 'Skill points on level-up'})
  @prop()
  levelSkillPoints!: Number;
}
