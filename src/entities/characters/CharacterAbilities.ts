import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import { CharacterAbility } from './CharacterAbility';
import { AbilityInput } from './character-inputs';
import { StatModifier } from './StatModifier';
import { ModifierSource, ModifierType } from '../../typings/modifiers';
import { Race } from '../races/Race';
import { AbilityType } from '../../typings/abilities';

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

  @Field({ description: 'Indicates if the ability points has been allocated' })
  @prop({ required: true, default: false })
  isAllocated!: boolean;


  // Setter for abilities. Sets the base value, 
  // calculates the modifier, and final value
  private setAbilitiy(abilityName: AbilityType, value: number) {
    const modifierCalcArray = [
      0, -5, -4, -4, -3, -3, -2, -2, -1, -1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5,
    ];

    this[abilityName].baseValue = value;
    this[abilityName].modifier = modifierCalcArray[value];
    this.calculateFinal(abilityName);
  }

  // Resets modifiers. This is useful, if the user changes a race, 
  // and wants to clear existing modifiers before setting new ones.
  private resetModifiers(source: ModifierSource) {
    this.strength.statModifiers = this.strength.statModifiers.filter(
      (modifier) => modifier.modifierSource !== source
    );
    this.dexterity.statModifiers = this.dexterity.statModifiers.filter(
      (modifier) => modifier.modifierSource !== source
    );
    this.constitution.statModifiers = this.constitution.statModifiers.filter(
      (modifier) => modifier.modifierSource !== source
    );
    this.intelligence.statModifiers = this.intelligence.statModifiers.filter(
      (modifier) => modifier.modifierSource !== source
    );
    this.charisma.statModifiers = this.charisma.statModifiers.filter(
      (modifier) => modifier.modifierSource !== source
    );
    this.wisdom.statModifiers = this.wisdom.statModifiers.filter(
      (modifier) => modifier.modifierSource !== source
    );
  }

  //Setting modifiers for abilities, like race and class. 
  private setModifier(
    target: AbilityType,
    source: ModifierSource,
    type: ModifierType,
    value: number
  ) {
    const modifier: StatModifier = {
      modifierSource: source,
      modifierType: type,
      modifierValue: value,
    };
    this[target].statModifiers.push(modifier);
  }

  //Calculates final value of the ability, based on modifiers and base. 
  private calculateFinal(target: AbilityType) {
    const modifiers = this[target].statModifiers;

    let bonus = 0;
    for (let i = 0; i < modifiers.length; i++) {
      bonus += modifiers[i].modifierValue;
    }

    this[target].finalValue = this[target].baseValue + bonus;
  }

  // Public method to set Racial modifiers, abstracts away implementation details.
  // Clears existing racial modifiers, to prevent stacking them, then sets new ones.
  public setRacialAbilityModifiers(race: DocumentType<Race>) {
    const abilityModifiers = race.raceModifiers.abilityModifiers;
    this.resetModifiers('race');
    if (abilityModifiers) {
      abilityModifiers.forEach(({ abilityName, value }) => {
        this.setModifier(abilityName, 'race', 'perm', value),
          this.calculateFinal(abilityName);
      });
    }
  }
  // Setting abilities on allocation. TODO - remove commented code if not needed, 
  // mess attracts racoons. 
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

    // this.strength.baseValue = strength;
    // this.dexterity.baseValue = dexterity;
    // this.constitution.baseValue = constitution;
    // this.intelligence.baseValue = constitution;
    // this.charisma.baseValue = charisma;
    // this.wisdom.baseValue = wisdom;

    this.isAllocated = true;
  }
}

export const AbilitiesModel = getModelForClass(CharacterAbilities);
