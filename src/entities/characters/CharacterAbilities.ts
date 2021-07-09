import { prop } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import { CharacterAbility } from './CharacterAbility';

@ObjectType()
export class CharacterAbilities {
  @Field({ description: 'The characters Strength related values' })
  @prop({ required: true })
  strength!: CharacterAbility;

  @Field({ description: 'The characters Dexterity related values' })
  @prop({ required: true })
  dexterity!: CharacterAbility;

  @Field({ description: 'The characters Constitution related values' })
  @prop({ required: true })
  constitution!: CharacterAbility;

  @Field({ description: 'The characters Intellignce related values' })
  @prop({ required: true })
  intelligence!: CharacterAbility;

  @Field({ description: 'The characters Charisma related values' })
  @prop({ required: true })
  charisma!: CharacterAbility;

  @Field({ description: 'The characters Wisdom related values' })
  @prop({ required: true })
  wisdom!: CharacterAbility;
}
