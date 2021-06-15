import { prop  } from '@typegoose/typegoose';
import { ObjectType, Field} from 'type-graphql';

@ObjectType()
export class StatModifier {
   @Field()
   @prop()
   modifierType!: String

   @Field()
   @prop()
   modifierValue!: Number

}

@ObjectType()
export class Health {
  @Field({description: 'The characters maximum health'})
  @prop()
  maximumHealth!: Number

  @Field({description: 'The characters actual health'})
  @prop()
  actualHealth!: Number

  @Field({description: 'Health point die per level'})
  @prop()
  healthPerLevel!: Number

  @Field(() => [StatModifier], {description: 'Health point die per level'})
  @prop()
  healthModifiers!: StatModifier[] 
}

@ObjectType()
export class PhysicalStats {
  @Field(() => Health, { description: 'Current and maximum health of the Character'})
  @prop()
  health!: Health
}