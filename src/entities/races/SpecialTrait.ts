import { prop } from "@typegoose/typegoose";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class SpecialTrait {
  @Field({description: 'Name of a special racial trait, or ability'})
  @prop({required: true})
  traitName!: String

  @Field({description: 'Description of the special trait'})
  @prop({required: true})
  traitDescription!: String

  // May be able to add a trait modifier in the future, to handle the 
  // actual gameplay mechanics
}