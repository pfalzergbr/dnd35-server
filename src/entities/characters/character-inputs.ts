import { InputType, Field } from 'type-graphql';
import { Length, Max, Min } from 'class-validator';
import { Character } from './Character';

@InputType()
export class CharacterInput implements Partial<Character> {
  @Field()
  @Length(2, 30)
  name!: String;
}

@InputType()
export class AbilityInput {
  @Field()
  @Min(1)
  @Max(20)
  strength!: number;
  
  @Field()
  @Min(1)
  @Max(20)
  dexterity!: number;
  
  @Field()
  @Min(1)
  @Max(20)
  constitution!: number;
  
  @Field()
  @Min(1)
  @Max(20)
  intelligence!: number;
  
  @Field()
  @Min(1)
  @Max(20)
  charisma!: number;
  
  @Field()
  @Min(1)
  @Max(20)
  wisdom!: number;
}
