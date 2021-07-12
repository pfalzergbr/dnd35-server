import { prop } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import { CharacterAbility } from './CharacterAbility';
import { AbilityInput } from './character-inputs';

export type AbilityType =
  | 'strength'
  | 'dexterity'
  | 'constitution'
  | 'intelligence'
  | 'charisma'
  | 'wisdom';

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

  private setAbilitiy(abilityName: AbilityType, value: number) {
    const modifierCalcArray = [
      0, -5, -4, -4, -3, -3, -2, -2, -1, -1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5,
    ];

    this[abilityName].baseValue = value;
    this[abilityName].modifier = modifierCalcArray[value]
  }

  public setAbilities(abilityValues: AbilityInput) {
    const {
      strength,
      dexterity,
      constitution,
      intelligence,
      charisma,
      wisdom,
    } = abilityValues;

    this.setAbilitiy('strength', strength);
    this.setAbilitiy('dexterity', dexterity);
    this.setAbilitiy('constitution', constitution);
    this.setAbilitiy('intelligence', intelligence);
    this.setAbilitiy('charisma', charisma);
    this.setAbilitiy('wisdom', wisdom);

    this.strength.baseValue = strength;
    this.dexterity.baseValue = dexterity;
    this.constitution.baseValue = constitution;
    this.intelligence.baseValue = constitution;
    this.charisma.baseValue = charisma;
    this.wisdom.baseValue = wisdom;
  }
}
