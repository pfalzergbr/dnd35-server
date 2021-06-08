import { InputType, Field } from 'type-graphql';
import { Length } from 'class-validator';
import { Character } from './Character'

@InputType()
export class CharacterInput implements Partial<Character> {
  @Field()
  @Length(2, 30)
  name!: String
}