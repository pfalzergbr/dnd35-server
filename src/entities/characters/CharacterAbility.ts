import { pre, prop} from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import { StatModifier } from './StatModifier';

@ObjectType()
@pre<CharacterAbility>('save', function () {
  this.setAbilityModifier();
})

export class CharacterAbility {
  @Field({description: 'Ability score for this particular ability'})
  @prop({required: true})
  abilityScore!: number;
  @Field({description: 'Ability modifier for rolls, coming from this ability'})
  @prop({required: true})
  abilityModifier!: number;
  @Field({description: 'Modifiers effecting this ability'})
  @prop({required: true})
  statModifiers!: [StatModifier];

  public setAbilityModifier(){
    const bonusCalcArray = [
      0, -5, -4, -4, -3, -3, -2, -2, -1, -1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5,
    ];

    this.abilityModifier = bonusCalcArray[this.abilityScore];
  }


}